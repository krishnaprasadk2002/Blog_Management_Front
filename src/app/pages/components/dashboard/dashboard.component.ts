import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Author {
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  category: string;
  icon: 'video' | 'article' | 'case' | 'news';
  date: string;
  title: string;
  description: string;
  image: string;  // Added image property
  author: Author;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  blogPosts: BlogPost[] = [
    {
      id: 1,
      category: 'Tutorial',
      icon: 'video',
      date: '14 days ago',
      title: 'How to quickly deploy a static website',
      description: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
      image: '/assets/images/blog/web-deploy.jpg',  // Add your image path
      author: {
        name: 'Jese Leos',
        avatar: '/assets/images/avatars/avatar-1.jpg'
      }
    },
    {
      id: 2,
      category: 'Article',
      icon: 'article',
      date: '14 days ago',
      title: 'Our first project with React',
      description: 'Static websites are now used to bootstrap lots of websites and are becoming the basis for a variety of tools that even influence both web designers and developers.',
      image: '/assets/images/blog/react-project.jpg',  // Add your image path
      author: {
        name: 'Bonnie Green',
        avatar: '/assets/images/avatars/avatar-2.jpg'
      }
    },
    // ... other blog posts
  ];

  getCategoryIcon(type: string): string {
    switch (type) {
      case 'video':
        return `<svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                </svg>`;
      case 'article':
        return `<svg class="mr-1 w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clip-rule="evenodd"></path>
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z"></path>
                </svg>`;
      default:
        return '';
    }
  }

  onReadMore(postId: number): void {
    // Implement your read more logic here
    console.log('Reading more about post:', postId);
  }
}
