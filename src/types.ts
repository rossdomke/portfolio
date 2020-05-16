export class Ratio { 
  width: Number = 16;
  height: Number = 9;

  get value() {
    return `${this.width}:${this.height}`;
  }

  constructor(width: Number, height: Number) {
    this.width = width;
    this.height = height;
  }
}

export interface Photo {
  name: string;
  url: string;
  thumbnail: string;
  tags: Array<string>;
  ratio: Ratio;
}

export enum PostType {
  Text,
  Project,
  Photo,
}

export interface Post {
  title: string;
  slug?: string;
  body: string;
  photos?: Array<Photo>;
  tags?: Array<string>;
  postDate?: Date;
  type?: PostType;
}
