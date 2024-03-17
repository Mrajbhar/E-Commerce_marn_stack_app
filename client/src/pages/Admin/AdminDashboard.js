import React from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import { useAuth } from '../../context/auth';

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu/>
          </div>
          <div className="col-md-9">
            <div className="card p-3">
              <h2 className="card-title mb-4">Admin Details</h2>
              <div className="card-body">
                <div className="mb-3">
                  <h5 className="card-subtitle">Admin Name:</h5>
                  <p className="card-text">{auth?.user?.name}</p>
                </div>
                <div className="mb-3">
                  <h5 className="card-subtitle">Admin Email:</h5>
                  <p className="card-text">{auth?.user?.email}</p>
                </div>
                <div className="mb-3">
                  <h5 className="card-subtitle">Admin Contact:</h5>
                  <p className="card-text">{auth?.user?.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard;
