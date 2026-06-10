export default function DoctorCard({ doctor }) {
  return (
    <article className="people-card">
      <div className="people-card-image">
        <img src={doctor.photo} alt={doctor.name} />
      </div>
      <div className="people-card-body">
        <h3>{doctor.name}</h3>
        {doctor.qualification && <p>{doctor.qualification}</p>}
        <span>{doctor.role}</span>
      </div>
    </article>
  )
}
