const steps = [
  {
    title: "Call or Message Us",
    text: "Tell us what your car needs — or just walk in any time, no booking required.",
  },
  {
    title: "Drive In to Our Shop",
    text: "Bring your car to Main Boulevard, Gulberg III. Parking is available.",
  },
  {
    title: "Relax While We Work",
    text: "Take a seat in our waiting area while our team gets to work.",
  },
  {
    title: "Drive Away Shining",
    text: "Check the results yourself, and pay only when you're happy.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="alt-bg">
      <div className="container">
        <div className="section-head">
          <span className="kicker">How It Works</span>
          <h2>Booking Us Is Easy</h2>
          <p>
            No apps, no forms to fill. Just call or message us and we&apos;ll
            handle the rest.
          </p>
        </div>

        <ol className="steps" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {steps.map((step, i) => (
            <li className="step" key={step.title}>
              <div className="step-num" aria-hidden="true">
                {i + 1}
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
