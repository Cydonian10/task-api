import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CollaboratorEntity } from "./collaborator.entity.js";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

@Entity("Task")
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "varchar",
    length: 50,
    enum: TaskStatus,
  })
  status!: TaskStatus;

  @Column({ type: "decimal", nullable: false, default: 0 })
  order!: number;

  @Column({ name: "due_date", type: "timestamp", nullable: true })
  dueDate!: Date | null;

  @Column({ name: "collaborator_id", type: "int" })
  collaboratorId!: number;

  @ManyToOne(() => CollaboratorEntity, (collaborator) => collaborator.tasks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "collaborator_id" })
  collaborator!: CollaboratorEntity;
}
