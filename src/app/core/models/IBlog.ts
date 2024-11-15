export interface IBlog {
    _id?: string;                 
    title: string;               
    category: string;           
    content: string;           
    image: {                      
      key: string;
      url: string;
    };
    tags: string[];               
    authorId: string;              
    createdAt?: Date;             
    updatedAt?: Date;              
  }