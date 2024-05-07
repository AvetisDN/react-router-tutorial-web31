import React from "react";
import { Form, NavLink, Outlet, useLoaderData } from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export async function loader() {
  const contacts = await getContacts();
  return { contacts };
}
export async function action() {
  const contact = await createContact();
  return { contact };
}

const Root = () => {
  const { contacts } = useLoaderData();
  console.log(contacts);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              type="search"
              id="q"
              name="q"
              aria-label="Search contacts"
              placeholder="Search"
            />
            <div id="search-spinner" aria-hidden hidden={true}></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/">Home Page</NavLink>
            </li>
            <li className="divider"></li>
            {contacts.length ? (
              contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>Anonymous</i>
                    )}
                    {contact.favorite && <span>🤩</span>}
                  </NavLink>
                </li>
              ))
            ) : (
              <li>
                <i>No contacts yet</i>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default Root;
