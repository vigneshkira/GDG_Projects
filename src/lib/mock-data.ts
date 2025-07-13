
export type Notification = {
    platform: 'LinkedIn' | 'Gmail' | 'Instagram' | 'WhatsApp';
    sender: string;
    content: string;
    time: string;
    category: 'Important' | 'General' | 'Promotional';
    detectedDate?: string;
};

export const mockNotifications: Notification[] = [
    {
        platform: 'LinkedIn',
        sender: 'Jane Doe @ Google',
        content: 'Hi, please join us for the Google Developer event on Friday.',
        time: '10m ago',
        category: 'Important',
        detectedDate: 'Friday'
    },
    {
        platform: 'Gmail',
        sender: 'Coursera',
        content: 'Your certificate for the AI course is ready to be downloaded.',
        time: '45m ago',
        category: 'Important',
    },
    {
        platform: 'Instagram',
        sender: 'john_smith',
        content: 'Your friend sent you a reel.',
        time: '1h ago',
        category: 'General',
    },
    {
        platform: 'WhatsApp',
        sender: 'Project Team',
        content: 'Friendly reminder: Our weekly sync Zoom meeting starts in 30 mins.',
        time: '2h ago',
        category: 'Important',
    },
    {
        platform: 'Gmail',
        sender: 'Figma',
        content: 'What’s new in Figma: a new way to collaborate.',
        time: '5h ago',
        category: 'Promotional',
    },
];
