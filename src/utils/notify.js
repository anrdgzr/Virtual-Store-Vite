import toast from 'react-hot-toast';

const brutalistStyle = {
    border: '3px solid #000',
    padding: '12px 20px',
    color: '#000',
    fontWeight: '900',
    borderRadius: '8px',
    boxShadow: '6px 6px 0px #000',
    fontFamily: "'Inter', sans-serif", // Caprasimo
};

export const notify = {
    success: (message) => toast.success(message, {
        duration: 3000,
        style: {
            ...brutalistStyle,
            background: '#D6FF00',
        },
        iconTheme: {
            primary: '#000',
            secondary: '#D6FF00',
        },
    }),
    
    error: (message) => toast.error(message, {
        duration: 4000,
        style: {
            ...brutalistStyle,
            background: '#FF3366',
            color: '#fff',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#FF3366',
        },
    }),

    warning: (message) => toast(message, {
        icon: '⚠️',
        duration: 3000,
        style: {
            ...brutalistStyle,
            background: '#00E5FF',
        },
    }),
};