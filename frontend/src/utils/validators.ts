// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Password validation (min 8 chars, at least 1 letter and 1 number)
export const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
};

// Phone validation (basic)
export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
};

// Passport number validation (basic alphanumeric)
export const isValidPassport = (passport: string): boolean => {
    const passportRegex = /^[A-Z0-9]{6,9}$/;
    return passportRegex.test(passport.toUpperCase());
};

// Date validation (must be in future)
export const isFutureDate = (date: string): boolean => {
    return new Date(date) > new Date();
};

// Age validation (must be at least minAge years old)
export const isValidAge = (dateOfBirth: string, minAge: number = 0): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge;
    }

    return age >= minAge;
};
