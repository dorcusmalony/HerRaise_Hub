import { describe, it, expect } from 'vitest';



describe('Validation Tests - Form Inputs', () => {
    describe('Email Validation', () => {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        it('should accept valid emails', () => {
            expect(isValidEmail('user@example.com')).toBe(true);
            expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
        });

        it('should reject invalid emails', () => {
            expect(isValidEmail('invalid')).toBe(false);
            expect(isValidEmail('@example.com')).toBe(false);
            expect(isValidEmail('')).toBe(false);
        });
    });

    describe('Password Validation', () => {
        const isValidPassword = (password) => {
            return password.length >= 8 && 
                         /[A-Z]/.test(password) && 
                         /[a-z]/.test(password) && 
                         /[0-9]/.test(password);
        };

        it('should accept strong passwords', () => {
            expect(isValidPassword('Password123')).toBe(true);
            expect(isValidPassword('SecurePass99')).toBe(true);
        });

        it('should reject weak passwords', () => {
            expect(isValidPassword('weak')).toBe(false);
            expect(isValidPassword('noupppercase1')).toBe(false);
            expect(isValidPassword('NOLOWERCASE1')).toBe(false);
            expect(isValidPassword('NoNumbers')).toBe(false);
        });
    });

    describe('Required Field Validation', () => {
        const isRequired = (value) => {
            return value !== null && value !== undefined && value.trim() !== '';
        };

        it('should validate required fields', () => {
            expect(isRequired('valid input')).toBe(true);
        });

        it('should reject empty fields', () => {
            expect(isRequired('')).toBe(false);
            expect(isRequired('   ')).toBe(false);
            expect(isRequired(null)).toBe(false);
        });
    });

    describe('File Upload Validation', () => {
        const isValidFileType = (filename, allowedTypes) => {
            const extension = filename.split('.').pop().toLowerCase();
            return allowedTypes.includes(extension);
        };

        const isValidFileSize = (sizeInBytes, maxSizeInMB) => {
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
            return sizeInBytes <= maxSizeInBytes;
        };

        it('should validate file types', () => {
            const allowedTypes = ['jpg', 'png', 'pdf', 'docx'];
            expect(isValidFileType('document.pdf', allowedTypes)).toBe(true);
            expect(isValidFileType('image.jpg', allowedTypes)).toBe(true);
            expect(isValidFileType('virus.exe', allowedTypes)).toBe(false);
        });

        it('should validate file sizes', () => {
            expect(isValidFileSize(1024 * 1024, 5)).toBe(true);
            expect(isValidFileSize(10 * 1024 * 1024, 5)).toBe(false);
        });
    });
});
