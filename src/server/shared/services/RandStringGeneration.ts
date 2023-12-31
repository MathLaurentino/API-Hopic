import bcrypt from "bcryptjs";

export const RandString = (email: string): string => {
    
    const currentDate = new Date().toISOString();
    let key = bcrypt.hashSync(email + currentDate, 10);
    key = key.replace(/\//g, "");
    
    return key;

};

