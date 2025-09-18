import React, { useState } from "react";
import axios from "axios";
import { CalendarDaysIcon, HandRaisedIcon } from "@heroicons/react/24/outline";
import backendGlobalRoute from "../../config/config";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("weekly");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendGlobalRoute}/api/subscribe`, {
        email,
        subscriptionType,
      });
      setMessage(response.data.message);
      setEmail(""); // Clear the input field
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div>
      <div className="relative isolate overflow-hidden bg-white py-16 ">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            <div className="max-w-xl lg:max-w-lg">
              <h2 className="text-3xl font-bold tracking-tight text-gray-700 sm:text-4xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-700">
                Stay informed about the latest developments in our programs,
                research, and community initiatives.
              </p>
              <form
                onSubmit={handleSubmit}
                className="mt-6 flex max-w-md gap-x-4"
              >
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-auto rounded-md border-0 bg-gray-100 px-3.5 py-2 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />

                <button
                  type="submit"
                  className="flex-none rounded-md bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-cyan-600 hover:via-teal-600 hover:to-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Subscribe
                </button>
              </form>
              {message && (
                <p className="mt-4 text-sm text-green-500">{message}</p>
              )}
            </div>
            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-gray-100 p-2 ring-1 ring-gray-300">
                  <CalendarDaysIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-black"
                  />
                </div>
                <dt className="mt-4 font-semibold text-gray-700">
                  Monthly News
                </dt>
                <dd className="mt-2 leading-7 text-gray-500">
                  Get updates on new courses, faculty achievements, and student
                  success stories.
                </dd>
              </div>
              <div className="flex flex-col items-start">
                <div className="rounded-md bg-gray-100 p-2 ring-1 ring-gray-300">
                  <HandRaisedIcon
                    aria-hidden="true"
                    className="h-6 w-6 text-black"
                  />
                </div>
                <dt className="mt-4 font-semibold text-gray-700">No Spam</dt>
                <dd className="mt-2 leading-7 text-gray-500">
                  We respect your privacy and promise not to spam your inbox.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsLetter;
