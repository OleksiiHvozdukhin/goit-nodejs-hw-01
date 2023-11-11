import fs from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

const contactPath = path.resolve("db", "contacts.json");

export const listContacts = async () => {
  const allContacts = await fs.readFile(contactPath, "utf-8");
  return JSON.parse(allContacts);
};

export const getContactById = async (contactId) => {
  const allContact = await listContacts();
  const contact = allContact.find((obj) => obj.id === contactId);
  return contact || null;
};

export const removeContact = async (contactId) => {
  const allContact = await listContacts();
  const index = allContact.findIndex((item) => item.id === contactId);
  if (index === -1) return null;

  const [result] = allContact.splice(index, 1);
  await fs.writeFile(contactPath, JSON.stringify(allContact, null, 2));
  return result;
};

export const addContact = async (name, email, phone) => {
  if (name && email && phone) {
    const allContacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    allContacts.push(newContact);
    await fs.writeFile(contactPath, JSON.stringify(allContacts, null, 2));
    return newContact;
  }

  const missingVariable = ["name", "email", "phone"].find(
    (variable) => !eval(variable)
  );
  return `Переменная ${missingVariable} не введена!`;
};
