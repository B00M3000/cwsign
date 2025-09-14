import { load } from 'js-yaml';

export interface Meeting {
  id: number;
  title: string;
  presenter: string;
  date: string;
  description: string;
  room: string;
}

export interface MeetingsConfig {
  meetings: Meeting[];
}

export async function loadMeetingsConfig(): Promise<MeetingsConfig> {
  try {
    const response = await fetch('/meetings.yaml');

    if (!response.ok) {
      throw new Error(`Failed to fetch meetings.yaml: ${response.statusText}`);
    }

    const yamlText = await response.text();
    const config = load(yamlText) as MeetingsConfig;

    // Validate the config structure
    if (!config || !Array.isArray(config.meetings)) {
      throw new Error('Invalid meetings configuration: meetings array is required');
    }

    // Validate each meeting has required fields
    config.meetings.forEach((meeting, index) => {
      if (!meeting.id || !meeting.title || !meeting.presenter || !meeting.date || !meeting.description || !meeting.room) {
        throw new Error(`Invalid meeting at index ${index}: missing required fields`);
      }
    });

    return config;
  } catch (error) {
    console.error('Error loading meetings config:', error);
    // Return default fallback data
    return {
      meetings: [
        {
          id: 1,
          title: 'Intro to Web Development',
          presenter: 'Alex Johnson',
          date: '2025-09-12',
          description: 'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
          room: 'Conference Room A'
        },
        {
          id: 2,
          title: 'AI and Machine Learning',
          presenter: 'Sarah Lee',
          date: '2025-09-13',
          description: 'An introduction to machine learning concepts and real-world applications.',
          room: 'Lab 101'
        },
        {
          id: 3,
          title: 'Cybersecurity Basics',
          presenter: 'David Kim',
          date: '2025-09-15',
          description: 'Explore essential cybersecurity practices to stay safe online.',
          room: 'Auditorium B'
        }
      ]
    };
  }
}
