import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  videoId: string;

  @Column()
  userName: string;

  @Column()
  imageUrl: string;

  @Column()
  comment: string;

  @Column()
  postedAt: string;

  @Column()
  numberOfLikes: number;
}
