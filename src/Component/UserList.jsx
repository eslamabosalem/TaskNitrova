import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiFilter, FiChevronDown, FiX, FiPlus, FiChevronDown as FiChevronDownIcon } from 'react-icons/fi';
import { FiChevronUp } from 'react-icons/fi';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(97);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    company: '',
    phonePrefix: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
    setSelectAll(!selectAll);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    let result = [...users];
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.company) {
      result = result.filter(user => 
        user.company?.name.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    
    if (filters.phonePrefix) {
      result = result.filter(user => 
        user.phone.startsWith(filters.phonePrefix)
      );
    }
    
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = sortConfig.key.split('.').reduce((o, i) => o?.[i], a);
        const bValue = sortConfig.key.split('.').reduce((o, i) => o?.[i], b);
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredUsers(result);
    setTotalUsers(result.length);
    setCurrentPage(1); 
    setSelectAll(false); 
  }, [searchTerm, filters, users, sortConfig]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setFilters({
      company: '',
      phonePrefix: ''
    });
    setSearchTerm('');
  };

  const handleAddUser = () => {
    navigate('/users/new');
  };

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <span className="flex flex-col ml-1">
          <FiChevronUp className="h-3 w-3 text-gray-400" />
          <FiChevronDownIcon className="h-3 w-3 text-gray-400 -mt-1" />
        </span>
      );
    }
    return (
      <span className="ml-1">
        {sortConfig.direction === 'asc' ? (
          <FiChevronUp className="h-3 w-3 text-blue-600" />
        ) : (
          <FiChevronDownIcon className="h-3 w-3 text-blue-600" />
        )}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <FiFilter />
              <span className="hidden md:inline">Filters</span>
              <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {(filters.company || filters.phonePrefix) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto justify-center"
        >
          <FiPlus />
          <span>Add User</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="bg-white p-4 mb-6 border rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                placeholder="Filter by company"
                className="w-full px-3 py-2 border rounded-md"
                value={filters.company}
                onChange={(e) => setFilters({...filters, company: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Prefix</label>
              <input
                type="text"
                placeholder="Filter by phone prefix"
                className="w-full px-3 py-2 border rounded-md"
                value={filters.phonePrefix}
                onChange={(e) => setFilters({...filters, phonePrefix: e.target.value})}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm text-gray-600 font-medium items-center">
        <div className="col-span-1 flex items-center">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
          />
          #
        </div>
        <div 
          className="col-span-3 flex items-center cursor-pointer hover:text-gray-800"
          onClick={() => requestSort('name')}
        >
          NAME
          <SortIndicator columnKey="name" />
        </div>
        <div 
          className="col-span-4 flex items-center cursor-pointer hover:text-gray-800"
          onClick={() => requestSort('email')}
        >
          EMAIL
          <SortIndicator columnKey="email" />
        </div>
        <div 
          className="col-span-2 flex items-center cursor-pointer hover:text-gray-800"
          onClick={() => requestSort('phone')}
        >
          PHONE NUMBER
          <SortIndicator columnKey="phone" />
        </div>
        <div 
          className="col-span-2 flex items-center cursor-pointer hover:text-gray-800"
          onClick={() => requestSort('company.name')}
        >
          COMPANY NAME
          <SortIndicator columnKey="company.name" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Desktop Users List */}
          <div className="hidden md:block space-y-2">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className="grid grid-cols-12 gap-4 py-3 border-b hover:bg-gray-50 items-center"
                >
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleUserSelect(user.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {indexOfFirstUser + index + 1}
                  </div>
                  <div 
                    className="col-span-3 font-medium cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    {user.name}
                  </div>
                  <div 
                    className="col-span-4 text-gray-600 cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    {user.email}
                  </div>
                  <div 
                    className="col-span-2 text-gray-600 cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    {user.phone}
                  </div>
                  <div 
                    className="col-span-2 text-gray-600 cursor-pointer"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    {user.company?.name || 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>

          {/* Mobile Users List */}
          <div className="md:hidden space-y-3">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/users/${user.id}`)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="font-medium">{indexOfFirstUser + index + 1}. {user.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{user.company?.name || 'N/A'}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{user.email}</div>
                  <div className="text-sm text-gray-600">{user.phone}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No users found matching your criteria
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstUser + 1} to {indexOfLastUser} of {totalUsers} users
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => paginate(currentPage - 1)} 
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <button 
            onClick={() => paginate(currentPage + 1)} 
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
            disabled={currentPage === Math.ceil(totalUsers / usersPerPage)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
