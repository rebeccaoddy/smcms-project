import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

export const getUsersData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getUsers');
      const users = response.data;
  
      // GPA
      const chartData = users
        .filter(user => !isNaN(user.hs_gpa)) // Filter out NaN values
        .map(user => ({
          label: user.first_name,
          value: user.hs_gpa // Assuming GPA is a numerical value
        }));
        
      // UserNames for list view
      const names = users.map(user => user.first_name);

      // AGE
      const chartData2 = users
        .filter(user => !isNaN(user.entry_age)) // Filter out NaN values
        .map(user => ({
          label: user.first_name,
          value: user.entry_age // Assuming entry_age is a numerical value
        }));
  
      // LineData
      const chartData3 = [
        {
          id: 'GPA', // id represents the label for this series
          data: users
            .filter(user => !isNaN(user.hs_gpa)) // Filter out NaN values
            .map(user => ({
              x: user.first_name, // x represents the category or label on the x-axis
              y: user.hs_gpa // y represents the value on the y-axis
            }))
        }
      ];
  
      return { users, names, chartData, chartData2, chartData3 };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

export const getStudentsData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/getStudents');
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  };