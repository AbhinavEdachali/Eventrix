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
import { useNavigate } from "react-router-dom";
import backendGlobalRoute from "../../config/config";

const AddVendor = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_email: "",
    vendor_phone: "",
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
  const vendorNameRef = useRef();
  const vendorEmailRef = useRef();
  const vendorPhoneRef = useRef();
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
    setVendor({ ...vendor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    let firstInvalidRef = null;
    if (!vendor.vendor_name) {
      newErrors.vendor_name = "Vendor name is required.";
      firstInvalidRef = firstInvalidRef || vendorNameRef;
    }
    if (!vendor.vendor_email) {
      newErrors.vendor_email = "Vendor email is required.";
      firstInvalidRef = firstInvalidRef || vendorEmailRef;
    }
    if (!vendor.vendor_phone) {
      newErrors.vendor_phone = "Vendor phone is required.";
      firstInvalidRef = firstInvalidRef || vendorPhoneRef;
    }
    if (!vendor.street) {
      newErrors.street = "Street is required.";
      firstInvalidRef = firstInvalidRef || streetRef;
    }
    if (!vendor.city) {
      newErrors.city = "City is required.";
      firstInvalidRef = firstInvalidRef || cityRef;
    }
    if (!vendor.state) {
      newErrors.state = "State is required.";
      firstInvalidRef = firstInvalidRef || stateRef;
    }
    if (!vendor.zip_code) {
      newErrors.zip_code = "Zip code is required.";
      firstInvalidRef = firstInvalidRef || zipCodeRef;
    }
    if (!vendor.country) {
      newErrors.country = "Country is required.";
      firstInvalidRef = firstInvalidRef || countryRef;
    }
    if (!vendor.company_name) {
      newErrors.company_name = "Company name is required.";
      firstInvalidRef = firstInvalidRef || companyNameRef;
    }
    if (!vendor.company_registration_number) {
      newErrors.company_registration_number = "Registration number is required.";
      firstInvalidRef = firstInvalidRef || companyRegRef;
    }
    if (!vendor.bank_name) {
      newErrors.bank_name = "Bank name is required.";
      firstInvalidRef = firstInvalidRef || bankNameRef;
    }
    if (!vendor.account_number) {
      newErrors.account_number = "Account number is required.";
      firstInvalidRef = firstInvalidRef || accountNumberRef;
    }
    if (!vendor.ifsc_code) {
      newErrors.ifsc_code = "IFSC code is required.";
      firstInvalidRef = firstInvalidRef || ifscCodeRef;
    }

    setErrors(newErrors);

    if (firstInvalidRef && firstInvalidRef.current) {
      firstInvalidRef.current.focus();
      return;
    }

    const vendorData = {
      vendor_name: vendor.vendor_name,
      vendor_email: vendor.vendor_email,
      vendor_phone: vendor.vendor_phone,
      vendor_address: {
        street: vendor.street,
        city: vendor.city,
        state: vendor.state,
        zip_code: vendor.zip_code,
        country: vendor.country,
      },
      company_name: vendor.company_name,
      company_registration_number: vendor.company_registration_number,
      bank_details: {
        bank_name: vendor.bank_name,
        account_number: vendor.account_number,
        ifsc_code: vendor.ifsc_code,
      },
      status: vendor.status,
    };

    try {
      await axios.post(`${backendGlobalRoute}/api/add-vendor`, vendorData);
      alert("Vendor added successfully!");

      setVendor({
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
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
      navigate("/all-vendors");
    } catch (error) {
      console.error("Error adding vendor:", error);
      alert("There was an issue adding the vendor.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header with title and button */}
        <div className="flex justify-between items-center">
          <h2 className="text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Add New Vendor
          </h2>
          <Link to="/all-vendors">
            <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow hover:opacity-90 transition-opacity text-sm">
              View All Vendors
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaUser className="text-green-500 mr-2" /> Vendor Name
            </label>
            <input
              ref={vendorNameRef}
              type="text"
              name="vendor_name"
              value={vendor.vendor_name}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter vendor name"
            />
          </div>
          {errors.vendor_name && (
            <span className="block mt-1 text-red-500 text-xs">{errors.vendor_name}</span>
          )}

          {/* Email */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaEnvelope className="text-blue-500 mr-2" /> Email
            </label>
            <input
              ref={vendorEmailRef}
              type="email"
              name="vendor_email"
              value={vendor.vendor_email}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter vendor email"
            />
          </div>
          {errors.vendor_email && (
            <span className="block mt-1 text-red-500 text-xs">{errors.vendor_email}</span>
          )}

          {/* Phone */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaPhone className="text-green-500 mr-2" /> Phone
            </label>
            <input
              ref={vendorPhoneRef}
              type="text"
              name="vendor_phone"
              value={vendor.vendor_phone}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter vendor phone"
            />
          </div>
          {errors.vendor_phone && (
            <span className="block mt-1 text-red-500 text-xs">{errors.vendor_phone}</span>
          )}

          {/* Address */}
          {["street", "city", "state", "zip_code", "country"].map((field) => (
            <div className="flex items-center" key={field}>
              <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
                <FaHome className="text-green-500 mr-2" />{" "}
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                type="text"
                name={field}
                value={vendor[field]}
                onChange={handleChange}
                className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={`Enter ${field.replace("_", " ")}`}
              />
            </div>
          ))}

          {/* Company Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Company Name
            </label>
            <input
              ref={companyNameRef}
              type="text"
              name="company_name"
              value={vendor.company_name}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter company name"
            />
          </div>
          {errors.company_name && (
            <span className="block mt-1 text-red-500 text-xs">{errors.company_name}</span>
          )}

          {/* Registration Number */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Registration Number
            </label>
            <input
              ref={companyRegRef}
              type="text"
              name="company_registration_number"
              value={vendor.company_registration_number}
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
              <FaMoneyCheck className="text-blue-500 mr-2" /> BANK NAME
            </label>
            <input
              ref={bankNameRef}
              type="text"
              name="bank_name"
              value={vendor.bank_name}
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
              <FaMoneyCheck className="text-blue-500 mr-2" /> ACCOUNT NUMBER
            </label>
            <input
              ref={accountNumberRef}
              type="text"
              name="account_number"
              value={vendor.account_number}
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
              <FaMoneyCheck className="text-blue-500 mr-2" /> IFSC CODE
            </label>
            <input
              ref={ifscCodeRef}
              type="text"
              name="ifsc_code"
              value={vendor.ifsc_code}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter IFSC code"
            />
          </div>
          {errors.ifsc_code && (
            <span className="block mt-1 text-red-500 text-xs">{errors.ifsc_code}</span>
          )}
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center justify-center w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 rounded-md shadow hover:opacity-90 transition-opacity"
            >
              <MdSave className="mr-1" />
              Add Vendor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
