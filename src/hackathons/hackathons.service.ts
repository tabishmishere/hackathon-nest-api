import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';
import { Hackathon } from './interfaces/hackathon.interface';

@Injectable()
export class HackathonsService {
  private hackathons: Hackathon[] = [];

  async create(createHackathonDto: CreateHackathonDto, creatorId: string): Promise<Hackathon> {
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

    const newHackathon: Hackathon = {
      id: randomUUID(),
      title,
      description,
      startDate: start,
      endDate: end,
      maxParticipants,
      creatorId,
      createdAt: now,
    };

    this.hackathons.push(newHackathon);
    return newHackathon;
  }

  async findAll(): Promise<Hackathon[]> {
    return this.hackathons;
  }

  async findOne(id: string): Promise<Hackathon> {
    const hackathon = this.hackathons.find((h) => h.id === id);
    if (!hackathon) {
      throw new NotFoundException(`Hackathon with ID "${id}" not found`);
    }
    return hackathon;
  }

  async update(id: string, updateHackathonDto: UpdateHackathonDto): Promise<Hackathon> {
    const hackathon = await this.findOne(id);
    const index = this.hackathons.findIndex((h) => h.id === id);

    const { title, description, startDate, endDate, maxParticipants } = updateHackathonDto;

    const start = startDate ? new Date(startDate) : hackathon.startDate;
    const end = endDate ? new Date(endDate) : hackathon.endDate;

    if (startDate || endDate) {
      if (startDate && new Date(startDate) < new Date()) {
        throw new BadRequestException('Start date must be in the future');
      }
      if (end <= start) {
        throw new BadRequestException('End date must be after the start date');
      }
    }

    const updatedHackathon: Hackathon = {
      ...hackathon,
      ...(title && { title }),
      ...(description && { description }),
      ...(startDate && { startDate: start }),
      ...(endDate && { endDate: end }),
      ...(maxParticipants && { maxParticipants }),
    };

    this.hackathons[index] = updatedHackathon;
    return updatedHackathon;
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    this.hackathons = this.hackathons.filter((h) => h.id !== id);
    return { message: `Hackathon with ID "${id}" successfully deleted` };
  }
}
