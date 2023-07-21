import pool from "../config/queries";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';

let secret = process.env.SECRET;

// Personalized getUser for account page
const getUserByUsername = async (username: string) : Promise<IUser> =>  {
    return new Promise((resolve, reject) => {
        pool.query('SELECT username, email, bio, streamurl FROM users WHERE username = $1', [username], (error: Error, results: any) => {
        
            if (error) {
                reject(error)
            } else {
            resolve(results.rows[0]);
            }
        });
    });
};

// Get user for public profile
const getUserByUsernameClean = async (username: string) : Promise<IUser> =>  {
    return new Promise((resolve, reject) => {
        pool.query('SELECT username, email, bio, streamurl FROM users WHERE username = $1', [username], (error: Error, results: any) => {
            
            if (error) {
                reject(error)
            } else {
            resolve(results.rows[0]);
            }
            });
        });
};

const createUser = async (username: string, password: string, email: string, bio: string) : Promise<any> => {
    
    const salt = crypto.randomBytes(16).toString('hex');
    
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return new Promise((resolve, reject) => {
    pool.query('INSERT INTO users (username, pass, email, bio, salt) VALUES ($1, $2, $3, $4, $5)', [username, hash, email, bio, salt], (error: Error, results: any) => {
        if (error) {
            reject(error)
        } else {
            const token = generateAccessToken(username);
            resolve(token);
        }
    });
    });
}

const deleteUserByUsername = async (username: string) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM users WHERE username = $1', [username], (error: Error, results: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(results.rows[0]);
            }
    });
    });
}

const updateUserByUsername = async(username: string, newUsername: string, email: string, bio:string): Promise<any> => {
    return new Promise((resolve, reject)=> {
        pool.query('UPDATE users SET username = $1, email = $2, bio = $3 WHERE username = $4', [newUsername, email, bio, username], (error: Error, results: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(results.rows[0]);
            }
        });
    });
}

const updateUserPasswordByUsername = async(username: string, password: string, newPassword: string): Promise<any> => {
    
    let validUser = false;
    await getUserByUsername(username).then((user: any) => validUser = (user.password == hashPassword(password, user.salt)))

    if(!validUser) {
        return null;
    }

    return new Promise((resolve, reject) => {
        pool.query('update users SET pass = $1 where username = $2', [newPassword, username], (error: Error, results: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(results.rows[0]);
            }

        })
    })
};

const generateAccessToken = (username: string) => {
    return jwt.sign(username, secret);
}

const login = async (username: string, password: string) : Promise<any> => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE username = $1', [username], (error: Error, results: any) => {
            if (error) {
                reject(error)
            } else if(results.rowCount == 0){
                reject("Invalid Username or Password");
            } else {
                
                const userSalt = results.rows[0].salt
                const userHash = crypto.pbkdf2Sync(password, userSalt, 1000, 64, 'sha512').toString('hex');
                
                if (userHash === results.rows[0].pass) {
                    const token = generateAccessToken(username);
                    resolve(token);
                } else {
                    reject("Invalid Password")
                }
            }
        });
    });
}

const hashPassword = (password: string, salt: string): string => {

    return "baseString";
}


const authenticateToken = (authHeader: string) : number => {
    // Returns -1 for null --> 401 | 0 for invalid --> 403 and then 1 for anything valid
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return  -1;
    }
    jwt.verify(token, secret, (err: any, user: any) => {
        console.log(err)

        if(err) return 0;

    })
    return 1;
}

const authenticateTokenToUsername = (authHeader: string, username: string) : boolean => {
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
        return false;
    }
    let decodedValue = ";"
    jwt.verify(token, secret, (err: any, decoded: any) => {
        decodedValue = decoded;
        if (err) {
            return false;
    }})
    return decodedValue.trim() === username.trim();
}

export {
    getUserByUsername,
    getUserByUsernameClean,
    createUser,
    deleteUserByUsername,
    generateAccessToken,
    authenticateToken,
    authenticateTokenToUsername,
    login
}