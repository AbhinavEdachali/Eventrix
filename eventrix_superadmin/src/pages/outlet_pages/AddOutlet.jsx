import React, { useState, useRef } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaHome,
  FaMoneyCheck,
} from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { Link } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

const AddOutlet = () => {
  const [outlet, setOutlet] = useState({
    outlet_name: "",
    location: "",
    outlet_email: "",
    outlet_phone: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    company_name: "",
    company_registration_number: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const outletNameRef = useRef();
  const locationRef = useRef();
  const outletEmailRef = useRef();
  const outletPhoneRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const zipCodeRef = useRef();
  const countryRef = useRef();
  const companyNameRef = useRef();
  const companyRegRef = useRef();
  const bankNameRef = useRef();
  const accountNumberRef = useRef();
  const ifscCodeRef = useRef();

  const handleChange = (e) => {
    setOutlet({ ...outlet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    let firstInvalidRef = null;
    if (!outlet.outlet_name) {
      newErrors.outlet_name = "Outlet name is required.";
      firstInvalidRef = firstInvalidRef || outletNameRef;
    }
    if (!outlet.location) {
      newErrors.location = "Location is required.";
      firstInvalidRef = firstInvalidRef || locationRef;
    }
    if (!outlet.outlet_email) {
      newErrors.outlet_email = "Outlet email is required.";
      firstInvalidRef = firstInvalidRef || outletEmailRef;
    }
    if (!outlet.outlet_phone) {
      newErrors.outlet_phone = "Outlet phone is required.";
      firstInvalidRef = firstInvalidRef || outletPhoneRef;
    }
    if (!outlet.street) {
      newErrors.street = "Street is required.";
      firstInvalidRef = firstInvalidRef || streetRef;
    }
    if (!outlet.city) {
      newErrors.city = "City is required.";
      firstInvalidRef = firstInvalidRef || cityRef;
    }
    if (!outlet.state) {
      newErrors.state = "State is required.";
      firstInvalidRef = firstInvalidRef || stateRef;
    }
    if (!outlet.zip_code) {
      newErrors.zip_code = "Zip code is required.";
      firstInvalidRef = firstInvalidRef || zipCodeRef;
    }
    if (!outlet.country) {
      newErrors.country = "Country is required.";
      firstInvalidRef = firstInvalidRef || countryRef;
    }
    if (!outlet.company_name) {
      newErrors.company_name = "Company name is required.";
      firstInvalidRef = firstInvalidRef || companyNameRef;
    }
    if (!outlet.company_registration_number) {
      newErrors.company_registration_number = "Registration number is required.";
      firstInvalidRef = firstInvalidRef || companyRegRef;
    }
    if (!outlet.bank_name) {
      newErrors.bank_name = "Bank name is required.";
      firstInvalidRef = firstInvalidRef || bankNameRef;
    }
    if (!outlet.account_number) {
      newErrors.account_number = "Account number is required.";
      firstInvalidRef = firstInvalidRef || accountNumberRef;
    }
    if (!outlet.ifsc_code) {
      newErrors.ifsc_code = "IFSC code is required.";
      firstInvalidRef = firstInvalidRef || ifscCodeRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    const outletData = {
      outlet_name: outlet.outlet_name,
      location: outlet.location,
      outlet_email: outlet.outlet_email,
      outlet_phone: outlet.outlet_phone,
      outlet_address: {
        street: outlet.street,
        city: outlet.city,
        state: outlet.state,
        zip_code: outlet.zip_code,
        country: outlet.country,
      },
      company_name: outlet.company_name,
      company_registration_number: outlet.company_registration_number,
      bank_details: {
        bank_name: outlet.bank_name,
        account_number: outlet.account_number,
        ifsc_code: outlet.ifsc_code,
      },
      status: outlet.status,
    };

    try {
      await axios.post(`${backendGlobalRoute}/api/add-outlet`, outletData);
      alert("Outlet added successfully!");
      setOutlet({
        outlet_name: "",
        location: "",
        outlet_email: "",
        outlet_phone: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        company_name: "",
        company_registration_number: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error adding outlet:", error);
      alert("There was an issue adding the outlet.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header with title and button */}
        <div className="flex justify-between items-center">
          <h2 className="text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Add New Outlet
          </h2>
          <Link to="/all-outlets">
            <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow hover:opacity-90 transition-opacity text-sm">
              View All Outlets
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outlet Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaUser className="text-green-500 mr-2" /> Outlet Name
            </label>
            <input
              ref={outletNameRef}
              type="text"
              name="outlet_name"
              value={outlet.outlet_name}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet name"
            />
          </div>
          {errors.outlet_name && (
            <span className="block mt-1 text-red-500 text-xs">{errors.outlet_name}</span>
          )}

          {/* Location */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Location
            </label>
            <input
              ref={locationRef}
              type="text"
              name="location"
              value={outlet.location}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter location"
            />
          </div>
          {errors.location && (
            <span className="block mt-1 text-red-500 text-xs">{errors.location}</span>
          )}

          {/* Outlet Email */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaEnvelope className="text-blue-500 mr-2" /> Email
            </label>
            <input
              ref={outletEmailRef}
              type="email"
              name="outlet_email"
              value={outlet.outlet_email}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet email"
            />
          </div>
          {errors.outlet_email && (
            <span className="block mt-1 text-red-500 text-xs">{errors.outlet_email}</span>
          )}

          {/* Outlet Phone */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaPhone className="text-green-500 mr-2" /> Phone
            </label>
            <input
              ref={outletPhoneRef}
              type="text"
              name="outlet_phone"
              value={outlet.outlet_phone}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet phone"
            />
          </div>
          {errors.outlet_phone && (
            <span className="block mt-1 text-red-500 text-xs">{errors.outlet_phone}</span>
          )}

          {/* Address fields */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Street
            </label>
            <input
              ref={streetRef}
              type="text"
              name="street"
              value={outlet.street}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter street"
            />
          </div>
          {errors.street && (
            <span className="block mt-1 text-red-500 text-xs">{errors.street}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> City
            </label>
            <input
              ref={cityRef}
              type="text"
              name="city"
              value={outlet.city}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter city"
            />
          </div>
          {errors.city && (
            <span className="block mt-1 text-red-500 text-xs">{errors.city}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> State
            </label>
            <input
              ref={stateRef}
              type="text"
              name="state"
              value={outlet.state}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter state"
            />
          </div>
          {errors.state && (
            <span className="block mt-1 text-red-500 text-xs">{errors.state}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Zip Code
            </label>
            <input
              ref={zipCodeRef}
              type="text"
              name="zip_code"
              value={outlet.zip_code}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter zip code"
            />
          </div>
          {errors.zip_code && (
            <span className="block mt-1 text-red-500 text-xs">{errors.zip_code}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Country
            </label>
            <input
              ref={countryRef}
              type="text"
              name="country"
              value={outlet.country}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter country"
            />
          </div>
          {errors.country && (
            <span className="block mt-1 text-red-500 text-xs">{errors.country}</span>
          )}

          {/* Company Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Company Name
            </label>
            <input
              ref={companyNameRef}
              type="text"
              name="company_name"
              value={outlet.company_name}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter company name"
            />
          </div>
          {errors.company_name && (
            <span className="block mt-1 text-red-500 text-xs">{errors.company_name}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Registration Number
            </label>
            <input
              ref={companyRegRef}
              type="text"
              name="company_registration_number"
              value={outlet.company_registration_number}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter registration number"
            />
          </div>
          {errors.company_registration_number && (
            <span className="block mt-1 text-red-500 text-xs">{errors.company_registration_number}</span>
          )}

          {/* Bank Details */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> Bank Name
            </label>
            <input
              ref={bankNameRef}
              type="text"
              name="bank_name"
              value={outlet.bank_name}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter bank name"
            />
          </div>
          {errors.bank_name && (
            <span className="block mt-1 text-red-500 text-xs">{errors.bank_name}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> Account Number
            </label>
            <input
              ref={accountNumberRef}
              type="text"
              name="account_number"
              value={outlet.account_number}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter account number"
            />
          </div>
          {errors.account_number && (
            <span className="block mt-1 text-red-500 text-xs">{errors.account_number}</span>
          )}

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> IFSC Code
            </label>
            <input
              ref={ifscCodeRef}
              type="text"
              name="ifsc_code"
              value={outlet.ifsc_code}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter IFSC code"
            />
          </div>
          {errors.ifsc_code && (
            <span className="block mt-1 text-red-500 text-xs">{errors.ifsc_code}</span>
          )}

          {/* Status */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              Status
            </label>
            <select
              name="status"
              value={outlet.status}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center justify-center w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 rounded-md shadow hover:opacity-90 transition-opacity"
            >
              <MdSave className="mr-1" />
              Add Outlet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutlet;
