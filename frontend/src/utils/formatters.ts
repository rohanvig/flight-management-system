// Date and time formatting utilities
export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatTime = (date: string | Date): string => {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateTime = (date: string | Date): string => {
    return `${formatDate(date)} ${formatTime(date)}`;
};

// Currency formatting
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
    }).format(amount);
};

// Duration formatting (minutes to hours and minutes)
export const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
};

// Flight number formatting
export const formatFlightNumber = (flightNumber: string): string => {
    return flightNumber.toUpperCase();
};
