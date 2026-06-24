import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <Link className="people-card" to={`/doctor/${doctor.slug}`}>
      <div className="people-card-image">
        <img src={doctor.photo} alt={doctor.name} />
      </div>
      <div className="people-card-body">
        <h3>{doctor.name}</h3>
        {doctor.qualification && <p>{doctor.qualification}</p>}
        <span>{doctor.role}</span>
      </div>
    </Link>
  )
}
