import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HackathonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHackathonDto: CreateHackathonDto, creatorId: string) {
    const { title, description, startDate, endDate, maxParticipants } = createHackathonDto;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      throw new BadRequestException('Start date must be in the future');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be after the start date');
    }

    return this.prisma.hackathon.create({
      data: {
        title,
        description,
        startDate: start,
        endDate: end,
        maxParticipants,
        creatorId,
      },
    });
  }

  async findAll() {
    return this.prisma.hackathon.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
        _count: { select: { registrations: true } },
      },
    });
    if (!hackathon) {
      throw new NotFoundException(`Hackathon with ID "${id}" not found`);
    }
    return hackathon;
  }

  async update(id: string, updateHackathonDto: UpdateHackathonDto) {
    // Verify hackathon exists first
    const existingHackathon = await this.findOne(id);

    const { title, description, startDate, endDate, maxParticipants } = updateHackathonDto;

    // Build the data object only with provided fields
    const data: Record<string, any> = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (maxParticipants !== undefined) data.maxParticipants = maxParticipants;

    // Handle date validation
    if (startDate !== undefined || endDate !== undefined) {
      const start = startDate ? new Date(startDate) : existingHackathon.startDate;
      const end = endDate ? new Date(endDate) : existingHackathon.endDate;

      if (startDate && new Date(startDate) < new Date()) {
        throw new BadRequestException('Start date must be in the future');
      }
      if (end <= start) {
        throw new BadRequestException('End date must be after the start date');
      }

      if (startDate) data.startDate = start;
      if (endDate) data.endDate = end;
    }

    return this.prisma.hackathon.update({
      where: { id },
      data,
      include: {
        creator: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async remove(id: string) {
    // Verify hackathon exists first
    await this.findOne(id);

    await this.prisma.hackathon.delete({ where: { id } });
    return { message: `Hackathon with ID "${id}" successfully deleted` };
  }

  async join(hackathonId: string, userId: string) {
    // Verify hackathon exists
    const hackathon = await this.findOne(hackathonId);

    // Check if user is already registered
    const existingRegistration = await this.prisma.registration.findUnique({
      where: {
        userId_hackathonId: { userId, hackathonId },
      },
    });
    if (existingRegistration) {
      throw new ConflictException('You are already registered for this hackathon');
    }

    // Check if max participants limit has been reached
    const currentCount = await this.prisma.registration.count({
      where: { hackathonId },
    });
    if (currentCount >= hackathon.maxParticipants) {
      throw new BadRequestException('This hackathon has reached its maximum number of participants');
    }

    // Create the registration
    return this.prisma.registration.create({
      data: {
        userId,
        hackathonId,
      },
      include: {
        hackathon: {
          select: { id: true, title: true, startDate: true, endDate: true },
        },
      },
    });
  }

  async leave(hackathonId: string, userId: string) {
    // Verify hackathon exists
    await this.findOne(hackathonId);

    // Find the registration
    const registration = await this.prisma.registration.findUnique({
      where: {
        userId_hackathonId: { userId, hackathonId },
      },
    });
    if (!registration) {
      throw new NotFoundException('You are not registered for this hackathon');
    }

    await this.prisma.registration.delete({
      where: { id: registration.id },
    });

    return { message: 'Successfully left the hackathon' };
  }

  async getParticipants(hackathonId: string) {
    // Verify hackathon exists
    await this.findOne(hackathonId);

    const registrations = await this.prisma.registration.findMany({
      where: { hackathonId },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { registeredAt: 'asc' },
    });

    return registrations.map((r) => ({
      registrationId: r.id,
      registeredAt: r.registeredAt,
      ...r.user,
    }));
  }
}

