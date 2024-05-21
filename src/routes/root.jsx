import React, { useEffect } from "react";
import {
  Form,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { createContact, getContacts } from "../contacts";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

const Root = () => {
  const { contacts, q } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const handleSearch = (event) => {
    const isFirstSearch = q == null;
    submit(event.currentTarget.form, {
      replace: !isFirstSearch,
    });
  };

  useEffect(() => {
    document.querySelector("#q").value = q;
  }, [q]);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              type="search"
              id="q"
              name="q"
              aria-label="Search contacts"
              placeholder="Search"
              defaultValue={q}
              onChange={handleSearch}
              className={searching ? "loading" : ""}
            />
            <div id="search-spinner" aria-hidden hidden={!searching}></div>
          </Form>
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
