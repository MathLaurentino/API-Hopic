import { IItem } from "../../database/models";

interface ValidationResult {
    errors?: {
        body: {
            [key: string]: string;
        };
    };
}

export const validateItemUniqueness  = (items: IItem[], name: string, shortCut: string): ValidationResult | null => {
    const errors: { [key: string]: string } = {};

    items.forEach(item => {
        if (item.name.toUpperCase() === name.toUpperCase()) {
            errors["name"] = "name is already in use";
        }
        if (item.shortCut.toUpperCase() === shortCut.toUpperCase()) {
            errors["shortcut"] = "shortcut is already in use";
        }
    });

    if (Object.keys(errors).length > 0) {
        return { errors: { body: errors } };
    } else {
        return null;
    }
};