import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backendGlobalRoute from '../../config/config';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  // Change default menu to 'Dashboard'
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalProductsBooked, setTotalProductsBooked] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [categoryCount, setCategoryCount] = useState(null);
  const [productCount, setProductCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [blogCount, setBlogCount] = useState(null);
  const [vendorCount, setVendorCount] = useState(null);
  const [contactCount, setContactCount] = useState(null);
  const [outletCount, setOutletCount] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sidebarCount, setSidebarCount] = useState(null);
  const [sidebarItems, setSidebarItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]); // <-- Add contacts state
  const [vendors, setVendors] = useState([]); // <-- Add vendors state
  const [outlets, setOutlets] = useState([]); // <-- Add outlets state
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMenu === 'Dashboard') {
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem('token');
          // Fetch total users
          const resUsers = await axios.get(
            `${backendGlobalRoute}/api/get-totaluser-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTotalUsers(resUsers.data.totalUserCount);

          // Fetch all bookings and count products booked
          const resBookings = await axios.get(
            `${backendGlobalRoute}/api/book/all-books`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const bookings = resBookings.data || [];
          const productCount = bookings.reduce(
            (sum, booking) => sum + (Array.isArray(booking.products) ? booking.products.length : 0),
            0
          );
          setTotalProductsBooked(productCount);

          // Show 3 most recent bookings
          setRecentBookings(bookings.slice(0, 3));

          // Fetch recent reviews (limit 3)
          const resReviews = await axios.get(
            `${backendGlobalRoute}/api/allreviews`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRecentReviews((resReviews.data || []).slice(0, 3));
        } catch {
          setTotalUsers('N/A');
          setTotalProductsBooked('N/A');
          setRecentBookings([]);
          setRecentReviews([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    } else if (selectedMenu === 'Category') {
      // Fetch category count and all categories
      const fetchCategoryCount = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/all-categories`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          let count = 0;
          let cats = [];
          if (Array.isArray(res.data)) {
            count = res.data.length;
            cats = res.data;
          } else if (Array.isArray(res.data.categories)) {
            count = res.data.categories.length;
            cats = res.data.categories;
          }
          setCategoryCount(count);
          setCategories(cats);
        } catch {
          setCategoryCount(0);
          setCategories([]);
        }
      };
      fetchCategoryCount();
    } else if (selectedMenu === 'Product') {
      // Fetch product count and all products
      const fetchProductData = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/all-added-products`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const prods = Array.isArray(res.data) ? res.data : (res.data.products || []);
          setProductCount(prods.length);
          setProducts(prods);
        } catch {
          setProductCount(0);
          setProducts([]);
        }
      };
      fetchProductData();
    } else if (selectedMenu === 'User') {
      // Fetch user count and all users
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/all-users`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserCount(Array.isArray(res.data) ? res.data.length : 0);
          setUsers(Array.isArray(res.data) ? res.data : []);
        } catch {
          setUserCount(0);
          setUsers([]);
        }
      };
      fetchUserData();
    } else if (selectedMenu === 'Blog') {
      // Fetch blog count
      const fetchBlogCount = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/all-blogs`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setBlogCount(Array.isArray(res.data) ? res.data.length : (res.data.blogs?.length || 0));
        } catch {
          setBlogCount(0);
        }
      };
      fetchBlogCount();
    } else if (selectedMenu === 'Vendor') {
      // Fetch vendor count and all vendors
      const fetchVendorData = async () => {
        try {
          const token = localStorage.getItem('token');
          // Fetch vendor count
          const res = await axios.get(
            `${backendGlobalRoute}/api/vendors/count`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setVendorCount(res.data?.totalVendors ?? 0);

          // Fetch all vendors
          const resVendors = await axios.get(
            `${backendGlobalRoute}/api/all-vendors`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setVendors(Array.isArray(resVendors.data) ? resVendors.data : []);
        } catch {
          setVendorCount(0);
          setVendors([]);
        }
      };
      fetchVendorData();
    } else if (selectedMenu === 'Contacts') {
      // Fetch contacts/messages count and all contact details
      const fetchContactData = async () => {
        try {
          const token = localStorage.getItem('token');
          // Fetch count
          const resCount = await axios.get(
            `${backendGlobalRoute}/api/messages/get-messages-count`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setContactCount(resCount.data?.totalMessages ?? 0);

          // Fetch all contacts/messages
          const resContacts = await axios.get(
            `${backendGlobalRoute}/api/all-messages`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setContacts(Array.isArray(resContacts.data) ? resContacts.data : []);
        } catch {
          setContactCount(0);
          setContacts([]);
        }
      };
      fetchContactData();
    } else if (selectedMenu === 'Outlet') {
      // Fetch outlet count and all outlets
      const fetchOutletData = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/all-outlets`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const outletArr = Array.isArray(res.data) ? res.data : [];
          setOutletCount(outletArr.length);
          setOutlets(outletArr);
        } catch {
          setOutletCount(0);
          setOutlets([]);
        }
      };
      fetchOutletData();
    } else if (selectedMenu === 'Sidebar') {
      // Fetch sidebar count and all sidebar items
      const fetchSidebarData = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(
            `${backendGlobalRoute}/api/sidebar/all`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const items = Array.isArray(res.data) ? res.data : (res.data.sidebars || []);
          setSidebarCount(items.length);
          setSidebarItems(items);
        } catch {
          setSidebarCount(0);
          setSidebarItems([]);
        }
      };
      fetchSidebarData();
    }
  }, [selectedMenu]);

  const renderOptions = () => {
    switch (selectedMenu) {
      case 'Category':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/add-category" className="bg-indigo-500 text-white px-4 py-2 rounded inline-block mr-2">Add Category</a>
              <a href="/all-categories" className="bg-indigo-500 text-white px-4 py-2 rounded inline-block mr-2">All Categories</a>
              <a href="/update-categories" className="bg-indigo-500 text-white px-4 py-2 rounded inline-block">Edit Category</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-indigo-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Category</span>
              <span className="text-3xl font-bold text-indigo-600">
                {categoryCount !== null ? categoryCount : '...'}
              </span>
            </div>
            {/* Category List UI */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-indigo-700">All Categories</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Image</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Tags</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">No categories found.</td>
                      </tr>
                    ) : (
                      categories.map((cat, index) => (
                        <React.Fragment key={cat._id}>
                          <tr className="hover:bg-indigo-50 transition">
                            <td className="px-4 py-2">
                              {cat.category_image ? (
                                <img
                                  src={`${backendGlobalRoute}/${cat.category_image.replace(/\\/g, "/")}`}
                                  alt={cat.category_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">N/A</div>
                              )}
                            </td>
                            <td className="px-4 py-2 font-semibold text-indigo-700">{cat.category_name}</td>
                            <td className="px-4 py-2 text-gray-600">
                              <div className="line-clamp-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                {cat.description || "-"}
                              </div>
                            </td>
                            <td className="px-4 py-2 text-gray-500">
                              {cat.tags && cat.tags.length > 0
                                ? cat.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-block bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded mr-1 text-xs">{tag}</span>
                                  ))
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "-"}</td>
                          </tr>
                          {index < categories.length - 1 && (
                            <tr>
                              <td colSpan={5}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'Product':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/add-product" className="bg-green-500 text-white px-4 py-2 rounded inline-block mr-2">Add Product</a>
              <a href="/all-added-products" className="bg-green-500 text-white px-4 py-2 rounded inline-block mr-2">All Products</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-green-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Product</span>
              <span className="text-3xl font-bold text-green-600">
                {productCount !== null ? productCount : '...'}
              </span>
            </div>
            {/* Product List Table UI */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-700">All Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Image</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Price</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Vendor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-400">No products found.</td>
                      </tr>
                    ) : (
                      products.map((prod, idx) => (
                        <React.Fragment key={prod._id || idx}>
                          <tr className="hover:bg-green-50 transition">
                            <td className="px-4 py-2">
                              {prod.product_image ? (
                                <img
                                  src={`${backendGlobalRoute}/${prod.product_image.replace(/\\/g, "/")}`}
                                  alt={prod.product_name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400">N/A</div>
                              )}
                            </td>
                            <td className="px-4 py-2 font-semibold text-green-700">{prod.product_name}</td>
                            <td className="px-4 py-2 text-gray-600">{prod.category?.category_name || "-"}</td>
                            <td className="px-4 py-2 text-gray-600">
                              ₹{prod.selling_price?.toFixed(2) || "-"}
                              {prod.display_price && (
                                <span className="ml-2 text-xs text-gray-400 line-through">
                                  ₹{prod.display_price.toFixed(2)}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-gray-600">{prod.vendor?.vendor_name || "-"}</td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{prod.createdAt ? new Date(prod.createdAt).toLocaleDateString() : "-"}</td>
                          </tr>
                          {idx < products.length - 1 && (
                            <tr>
                              <td colSpan={6}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'User':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/all-users" className="bg-blue-500 text-white px-4 py-2 rounded inline-block mr-2">All Users</a>
             
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-blue-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of User</span>
              <span className="text-3xl font-bold text-blue-600">
                {userCount !== null ? userCount : '...'}
              </span>
            </div>
            {/* User List Table UI */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-700">All Users</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400">No users found.</td>
                      </tr>
                    ) : (
                      users.map((user, idx) => (
                        <React.Fragment key={user._id || idx}>
                          <tr className="hover:bg-blue-50 transition">
                            <td className="px-4 py-2 font-semibold text-blue-700">{user.name}</td>
                            <td className="px-4 py-2 text-gray-600">{user.email}</td>
                            <td className="px-4 py-2 text-gray-600">{user.role}</td>
                            <td className="px-4 py-2 text-gray-600">{user.phone || "-"}</td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                          </tr>
                          {idx < users.length - 1 && (
                            <tr>
                              <td colSpan={5}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'Blog':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/add-blog" className="bg-pink-500 text-white px-4 py-2 rounded inline-block mr-2">Add Blog</a>
              <a href="/all-blogs" className="bg-pink-500 text-white px-4 py-2 rounded inline-block mr-2">All Blogs</a>
              <a href="/delete-blog" className="bg-pink-500 text-white px-4 py-2 rounded inline-block">Delete Blog</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-pink-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Blog</span>
              <span className="text-3xl font-bold text-pink-600">
                {blogCount !== null ? blogCount : '...'}
              </span>
            </div>
          </>
        );
      case 'Sidebar':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/addsidebarcontentpage" className="bg-purple-500 text-white px-4 py-2 rounded inline-block mr-2">Add Sidebar</a>
               <a href="/deletesidebar" className="bg-purple-500 text-white px-4 py-2 rounded inline-block mr-2">Delete Sidebar</a>
               <a href="/allsidebar" className="bg-purple-500 text-white px-4 py-2 rounded inline-block mr-2">All Sidebar</a>
            </div>
            
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-purple-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Sidebar</span>
              <span className="text-3xl font-bold text-purple-600">
                {sidebarCount !== null ? sidebarCount : '...'}
              </span>
            </div>
            {/* Sidebar Content List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-purple-700">All Sidebar Content</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-purple-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Properties</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Display Types</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Locations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sidebarItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-gray-400">No sidebar content found.</td>
                      </tr>
                    ) : (
                      sidebarItems.map((item, idx) => (
                        <React.Fragment key={item._id || idx}>
                          <tr className="hover:bg-purple-50 transition">
                            <td className="px-4 py-2 font-semibold text-purple-700">{item.categoryId}</td>
                            <td className="px-4 py-2 text-gray-600">
                              {item.propertyValues && Object.keys(item.propertyValues).length > 0
                                ? Object.entries(item.propertyValues).map(([k, v]) => (
                                    <div key={k} className="text-xs">
                                      <span className="font-semibold">{k}:</span> {Array.isArray(v) ? v.join(", ") : v}
                                    </div>
                                  ))
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {item.displayTypes && Object.keys(item.displayTypes).length > 0
                                ? Object.entries(item.displayTypes).map(([k, v]) => (
                                    <div key={k} className="text-xs">
                                      <span className="font-semibold">{k}:</span> {v}
                                    </div>
                                  ))
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {item.locations && item.locations.length > 0
                                ? item.locations.map((loc, i) => (
                                    <div key={i} className="text-xs">{loc}</div>
                                  ))
                                : "-"}
                            </td>
                          </tr>
                          {idx < sidebarItems.length - 1 && (
                            <tr>
                              <td colSpan={4}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'Contacts':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/all-messages" className="bg-yellow-500 text-white px-4 py-2 rounded inline-block mr-2">All Messages</a>
              <a href="/all-replies" className="bg-yellow-500 text-white px-4 py-2 rounded inline-block">All Replies</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-yellow-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Contacts</span>
              <span className="text-3xl font-bold text-yellow-600">
                {contactCount !== null ? contactCount : '...'}
              </span>
            </div>
            {/* All Contacts Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-700">All Contact Messages</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Message</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Read</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Replies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-400">No contacts found.</td>
                      </tr>
                    ) : (
                      contacts.map((contact, idx) => (
                        <React.Fragment key={contact._id || idx}>
                          <tr className="hover:bg-yellow-50 transition">
                            <td className="px-4 py-2 font-semibold text-yellow-700">{contact.firstName}</td>
                            <td className="px-4 py-2 text-gray-600">{contact.email}</td>
                            <td className="px-4 py-2 text-gray-600">{contact.phone || "-"}</td>
                            <td className="px-4 py-2 text-gray-600">{contact.message_text}</td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "-"}</td>
                            <td className="px-4 py-2 text-gray-600">{contact.isRead ? "Yes" : "No"}</td>
                            <td className="px-4 py-2 text-gray-600">
                              {contact.replies && contact.replies.length > 0 ? (
                                <ul className="list-disc pl-4">
                                  {contact.replies.map((reply, rIdx) => (
                                    <li key={rIdx}>
                                      <span className="font-semibold">{reply.name}:</span> {reply.message}
                                      <span className="text-xs text-gray-400 ml-2">{reply.timestamp ? new Date(reply.timestamp).toLocaleString() : ""}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-xs text-gray-400">No replies</span>
                              )}
                            </td>
                          </tr>
                          {idx < contacts.length - 1 && (
                            <tr>
                              <td colSpan={7}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'Vendor':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/add-vendor" className="bg-orange-500 text-white px-4 py-2 rounded inline-block mr-2">Add Vendor</a>
              <a href="/all-vendors" className="bg-orange-500 text-white px-4 py-2 rounded inline-block">All Vendors</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-orange-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Vendor</span>
              <span className="text-3xl font-bold text-orange-600">
                {vendorCount !== null ? vendorCount : '...'}
              </span>
            </div>
            {/* All Vendors Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-orange-700">All Vendors</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-orange-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-gray-400">No vendors found.</td>
                      </tr>
                    ) : (
                      vendors.map((vendor, idx) => (
                        <React.Fragment key={vendor._id || idx}>
                          <tr className="hover:bg-orange-50 transition">
                            <td className="px-4 py-2 font-semibold text-orange-700">{vendor.vendor_name}</td>
                            <td className="px-4 py-2 text-gray-600">{vendor.vendor_email}</td>
                            <td className="px-4 py-2 text-gray-600">{vendor.vendor_phone}</td>
                            <td className="px-4 py-2 text-gray-600">{vendor.company_name}</td>
                            <td className="px-4 py-2 text-gray-600">{vendor.status}</td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : "-"}</td>
                          </tr>
                          {idx < vendors.length - 1 && (
                            <tr>
                              <td colSpan={6}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'Outlet':
        return (
          <>
            <div className="flex items-center gap-6 mb-6">
              <a href="/add-outlet" className="bg-teal-500 text-white px-4 py-2 rounded inline-block mr-2">Add Outlet</a>
              <a href="/all-outlets" className="bg-teal-500 text-white px-4 py-2 rounded inline-block">All Outlets</a>
            </div>
            <div className="w-36 h-24 flex flex-col items-center justify-center bg-white border-2 border-teal-400 rounded-lg shadow text-center mb-6">
              <span className="text-xs text-gray-500 mb-1">No of Outlet</span>
              <span className="text-3xl font-bold text-teal-600">
                {outletCount !== null ? outletCount : '...'}
              </span>
            </div>
            {/* All Outlets Table */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-teal-700">All Outlets</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-teal-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Phone</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outlets.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-gray-400">No outlets found.</td>
                      </tr>
                    ) : (
                      outlets.map((outlet, idx) => (
                        <React.Fragment key={outlet._id || idx}>
                          <tr className="hover:bg-teal-50 transition">
                            <td className="px-4 py-2 font-semibold text-teal-700">{outlet.outlet_name}</td>
                            <td className="px-4 py-2 text-gray-600">{outlet.outlet_email}</td>
                            <td className="px-4 py-2 text-gray-600">{outlet.outlet_phone}</td>
                            <td className="px-4 py-2 text-gray-600">{outlet.company_name}</td>
                            <td className="px-4 py-2 text-gray-600">{outlet.location}</td>
                            <td className="px-4 py-2 text-gray-600">{outlet.status}</td>
                            <td className="px-4 py-2 text-gray-400 text-xs">{outlet.created_at ? new Date(outlet.created_at).toLocaleDateString() : "-"}</td>
                          </tr>
                          {idx < outlets.length - 1 && (
                            <tr>
                              <td colSpan={7}>
                                <hr className="border-gray-900 border-2" />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      default:
        return <p className="text-gray-500">Select a menu</p>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#EAE8E1] text-gray-800 p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <button
          className={`block w-full text-left px-4 py-2 rounded ${
            selectedMenu === 'Dashboard'
              ? 'bg-white text-black font-bold'
              : 'hover:bg-white'
          }`}
          style={{
            border: "none",
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={() => setSelectedMenu('Dashboard')}
        >
          Dashboard
        </button>
        {['Category', 'Product', 'User', 'Sidebar', 'Blog', 'Contacts', 'Vendor', 'Outlet'].map((item) => (
          <button
            key={item}
            className={`block w-full text-left px-4 py-2 rounded ${
              selectedMenu === item
                ? 'bg-white text-black font-bold'
                : 'hover:bg-white'
            }`}
            style={{
              border: "none",
              transition: 'background 0.2s, color 0.2s',
            }}
            onClick={() => setSelectedMenu(item)}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10 bg-gray-100 w-full">
        <h1 className="text-3xl font-semibold mb-6">
          {selectedMenu === 'Dashboard'
            ? 'Superadmin:dashboard'
            : `${selectedMenu.toLowerCase()}:dashboard`}
        </h1>
        <div className="space-x-4">
          {selectedMenu === 'Dashboard' ? (
            <>
              <div className="flex flex-col md:flex-row gap-8 justify-center">
                {/* Users container */}
                <div className="bg-white rounded-xl shadow p-8 flex-1 flex flex-col items-center min-w-[250px]">
                  <h2 className="text-xl font-bold mb-4">Total Registered Users</h2>
                  <div className="text-4xl font-bold text-indigo-600 mb-2">
                    {loading ? '...' : totalUsers}
                  </div>
                </div>
                {/* Products booked container */}
                <div className="bg-white rounded-xl shadow p-8 flex-1 flex flex-col items-center min-w-[250px]">
                  <h2 className="text-xl font-bold mb-4">Total Products Booked</h2>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {loading ? '...' : totalProductsBooked}
                  </div>
                </div>
              </div>
              {/* Recent Bookings Editable Container */}
              <div className="bg-white rounded-xl shadow p-8 mt-10 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center flex-1">Recent Bookings</h2>
                  <button
                    className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                    style={{ minWidth: 120 }}
                    onClick={() => navigate("/bookingstatus")}
                  >
                    Show All
                  </button>
                </div>
                <div className="w-full overflow-x-auto">
                  {loading ? (
                    <div className="text-gray-400 text-center">Loading...</div>
                  ) : recentBookings.length === 0 ? (
                    <div className="text-gray-400 text-center">No bookings found.</div>
                  ) : (
                    <table className="w-full text-sm border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-3 text-left">User</th>
                          <th className="py-2 px-3 text-left">Email</th>
                          <th className="py-2 px-3 text-left">Product(s)</th>
                          <th className="py-2 px-3 text-left">Vendor</th>
                          <th className="py-2 px-3 text-left">Outlet</th>
                          <th className="py-2 px-3 text-left">Booking Date</th>
                          <th className="py-2 px-3 text-left">Status</th>
                          <th className="py-2 px-3 text-left">Notes</th>
                          <th className="py-2 px-3 text-left">Payment</th>
                          <th className="py-2 px-3 text-center">Modify Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b) => (
                          <tr key={b._id} className="border-b">
                            <td className="py-2 px-3">{b.user?.name || b.email || "User"}</td>
                            <td className="py-2 px-3">{b.email}</td>
                            <td className="py-2 px-3">
                              {b.products && b.products.length > 0 ? (
                                <ul>
                                  {b.products.map((prod, idx) => (
                                    <li key={idx}>
                                      {prod.product?.product_name || prod.product || "Product"}
                                      {prod.product_image && (
                                        <img
                                          src={`${backendGlobalRoute}/${prod.product_image.replace(/\\/g, "/")}`}
                                          alt="Product"
                                          className="w-8 h-8 object-cover inline ml-2 rounded"
                                        />
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-3">{b.vendor?.vendor_name || "-"}</td>
                            <td className="py-2 px-3">{b.outlet?.outlet_name || "-"}</td>
                            <td className="py-2 px-3">{b.bookingDate ? new Date(b.bookingDate).toLocaleString() : "-"}</td>
                            <td className="py-2 px-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  b.status === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : b.status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : b.status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : b.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-2 px-3">{b.notes || "-"}</td>
                            <td className="py-2 px-3">
                              {b.paymentMethod === "card"
                                ? `Card (${b.cardDetails?.cardName || ""})`
                                : "COD"}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault();
                                  const newStatus = e.target.status.value;
                                  try {
                                    const token = localStorage.getItem('token');
                                    await axios.put(
                                      `${backendGlobalRoute}/api/book/update-book/${b._id}`,
                                      { status: newStatus },
                                      { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                    setRecentBookings((prev) =>
                                      prev.map((bk) =>
                                        bk._id === b._id ? { ...bk, status: newStatus } : bk
                                      )
                                    );
                                    alert("Booking status updated!");
                                  } catch {
                                    alert("Failed to update status.");
                                  }
                                }}
                              >
                                <select
                                  name="status"
                                  defaultValue={b.status}
                                  className="border rounded px-2 py-1 text-xs"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="cancelled">Cancelled</option>
                                  <option value="completed">Completed</option>
                                </select>
                                <button
                                  type="submit"
                                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  Update
                                </button>
                              </form>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {/* Recent Reviews Container */}
              <div className="bg-white rounded-xl shadow p-8 mt-10 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-center flex-1">Recent Product Reviews</h2>
                  <button
                    className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                    style={{ minWidth: 120, border: "none" }}
                    onClick={() => navigate("/review-responce")}
                  >
                    Show All
                  </button>
                </div>
                <div className="w-full overflow-x-auto">
                  {loading ? (
                    <div className="text-gray-400 text-center">Loading...</div>
                  ) : recentReviews.length === 0 ? (
                    <div className="text-gray-400 text-center">No reviews found.</div>
                  ) : (
                    <table className="w-full text-sm border">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-3 text-left">User</th>
                          <th className="py-2 px-3 text-left">Product</th>
                          <th className="py-2 px-3 text-left">Rating</th>
                          <th className="py-2 px-3 text-left">Review</th>
                          <th className="py-2 px-3 text-left">Photos</th>
                          <th className="py-2 px-3 text-left">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentReviews.map((r) => (
                          <tr key={r._id} className="border-b">
                            <td className="py-2 px-3">{r.username || (r.userId && r.userId.name) || "User"}</td>
                            <td className="py-2 px-3">
                              {r.productId?.product_name || r.product_name || "-"}
                            </td>
                            <td className="py-2 px-3">{r.rating || "-"}</td>
                            <td className="py-2 px-3">{r.review || "-"}</td>
                            <td className="py-2 px-3">
                              {r.photos && r.photos.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {r.photos.map((photo, idx) => (
                                    <img
                                      key={idx}
                                      src={`${backendGlobalRoute}/${photo.replace(/\\/g, "/")}`}
                                      alt="Review"
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                  ))}
                                </div>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td className="py-2 px-3">
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          ) : (
            renderOptions()
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;