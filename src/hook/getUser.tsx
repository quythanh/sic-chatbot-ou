// hooks/useUserData.js

import { useState, useEffect } from 'react';
import * as api from '@/utils/api';
import IUser from '@/models/user';
export default  function useUserData() {
  const [userData, setUserData] = useState<IUser|null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Gọi API để lấy thông tin user từ server
      const data = await api.get_user_info2();
      setUserData(data);
    };

    fetchData();
  }, []);

  return userData;
}


