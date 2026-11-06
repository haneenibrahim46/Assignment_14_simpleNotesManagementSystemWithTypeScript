class GenericStorage<T> {
    private items: T[] = [];

    public addItem(item: T): void {
        this.items.push(item);
    }

    public removeItem(item: T): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    public getAllItems(): T[] {
        return [...this.items];
    }
}


class User {
    private _id: number;
    private _name: string;
    private _email: string;
    private _password: string;
    private _phone: string;
    private _age: number;

    constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
        this._id = id;
        this._name = name;
        this._email = email;
        this._password = password;
        this._phone = phone;
        
        if (age < 18 || age > 60) {
            throw new Error("Age must be between 18 and 60.");
        }
        this._age = age;
    }

    public get id(): number { return this._id; }
    public get name(): string { return this._name; }
    public get email(): string { return this._email; }
    public get phone(): string { return this._phone; }
    public get age(): number { return this._age; }

    public set age(newAge: number) {
        if (newAge < 18 || newAge > 60) {
            throw new Error("Age must be between 18 and 60.");
        }
        this._age = newAge;
    }

    public displayInfo(): void {
        console.log(`[User Info] ID: ${this._id} | Name: ${this._name} | Email: ${this._email} | Phone: ${this._phone} | Age: ${this._age}`);
    }
}


class Note {
    private id: number;
    private title: string;
    private content: string;

    private author: User; 

    constructor(id: number, title: string, content: string, author: User) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }

    public getId(): number {
        return this.id;
    }

    public getAuthor(): User {
        return this.author;
    }

    public preview(maxLength: number = 20): string {
        if (this.content.length <= maxLength) {
            return this.content;
        }
        return this.content.substring(0, maxLength) + "...";
    }

    public getFullNote(): string {
        return `Title: ${this.title}\nContent: ${this.content}\nAuthor: ${this.author.name}`;
    }
}


class NoteBook {
    private id: number;
    private title: string;

    private notes: Note[]; 

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
        this.notes = [];
    }

    public addNote(id: number, title: string, content: string, author: User): Note {
        const note = new Note(id, title, content, author);
        this.notes.push(note);
        return note;
    }

    public removeNote(noteId: number): void {
        this.notes = this.notes.filter(note => note.getId() !== noteId);
    }

    public getNotes(): Note[] {
        return this.notes;
    }

    public getTitle(): string {
        return this.title;
    }
}


class UserWithNotebooks extends User {
    private notebooks: NoteBook[] = [];

    public addNotebook(notebook: NoteBook): void {
        this.notebooks.push(notebook);
    }

    public getNotebooks(): NoteBook[] {
        return this.notebooks;
    }
}


class Admin extends User {
    constructor(id: number, name: string, email: string, password: string, phone: string, age: number) {
        super(id, name, email, password, phone, age);
    }

    public manageNote(note: Note, newContent: string): void {
        console.log(`[Admin Action] Admin '${this.name}' updated note ID ${note.getId()}`);
    }

    public deleteUserNote(notebook: NoteBook, noteId: number): void {
        notebook.removeNote(noteId);
        console.log(`[Admin Action] Admin '${this.name}' deleted note ID ${noteId} from Notebook '${notebook.getTitle()}'`);
    }
}


try {
    const user1 = new User(1, "Ahmed Ali", "ahmed@example.com", "pass123", "01012345678", 25);
    user1.displayInfo();

    const admin1 = new Admin(2, "Sara Admin", "sara@example.com", "adminPass", "01198765432", 30);
    admin1.displayInfo();

    const myNotebook = new NoteBook(101, "Work Notes");

    const note1 = myNotebook.addNote(1, "TypeScript Intro", "TypeScript adds type safety to JavaScript codebases.", user1);
    const note2 = myNotebook.addNote(2, "OOP Concepts", "Object Oriented Programming involves Inheritance, Encapsulation, Abstraction, and Polymorphism.", user1);

    console.log("Preview Note 1:", note1.preview(15));
    console.log("Preview Note 2:", note2.preview(25));

    admin1.manageNote(note1, "New Updated Content");
    admin1.deleteUserNote(myNotebook, 1);
    console.log("Remaining Notes in Notebook:", myNotebook.getNotes().length);

    const userStorage = new GenericStorage<User>();
    userStorage.addItem(user1);
    userStorage.addItem(admin1);
    console.log("Stored Users Count:", userStorage.getAllItems().length);

} catch (error: any) {
    console.error("Error:", error.message);
}