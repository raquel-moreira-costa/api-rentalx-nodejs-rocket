import {
  Column, CreateDateColumn, Entity, PrimaryColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity('users')
class User {
  @PrimaryColumn()
    id: string;
  @Column()
    name: string;
  @Column()

    password: string;
  @Column()

    driver_license: string;
  @Column()

    email: string;
  @Column()

    isAdmin: boolean;
  @CreateDateColumn()
    created_at: Date;

  @Column()
    avatar: string;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
