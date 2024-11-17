export interface IBlog {
    _id?: string;                 
    title: string;               
    category: string;           
    content: string;           
    image:string
    tags: string[];               
    authorId: string;              
    createdAt?: Date;             
    updatedAt?: Date;              
  }
