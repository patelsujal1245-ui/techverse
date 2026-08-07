import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { fetchMyOrders } from '../services/orderService'
import { fetchProfile } from '../services/userService'
import { safePrice } from '../data/catalog'

const Profile = () => {
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(user)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResponse, ordersResponse] = await Promise.all([fetchProfile(), fetchMyOrders()])
        setProfile(profileResponse.data)
        setOrders(ordersResponse.data || [])
      } catch {
        setProfile(user)
      }
    }

    loadProfile()
  }, [user])

  return (
    <section className="page-shell">
      <div className="section-header">
        <h1>Profile</h1>
        <p>View your account details and recent orders.</p>
      </div>
      <div className="profile-card">
        <p>
          <strong>Name:</strong> {profile?.name}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>
        <p>
          <strong>Role:</strong> {profile?.role}
        </p>
        {profile?.phone ? (
          <p>
            <strong>Phone:</strong> {profile.phone}
          </p>
        ) : null}
        {profile?.address ? (
          <p>
            <strong>Address:</strong> {profile.address}
          </p>
        ) : null}
      </div>

      <div className="spaced-top">
        <h2>My Orders</h2>
        {!orders.length ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <article key={order._id} className="order-card">
                <div>
                  <strong>Order #{order._id.slice(-6)}</strong>
                  <p>{order.orderStatus}</p>
                </div>
                <p>{safePrice(order.totalPrice)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
