import React, {useState} from 'react'
import Content from './Content'
import img1 from './Assests/hp_1.jpg'
import img2 from './Assests/hp_2.jpg'
/*import img3 from './Assests/hp_3.jpg'
import img4 from './Assests/hp_4.jpg'
import img5 from './Assests/hp_5.jpg'
import img6 from './Assests/hp_6.jpg'
import img7 from './Assests/hp_7.jpg'
import img8 from './Assests/hp_8.jpg'*/

const CourseList = () => {

  const courses = [
    { image: img1, name: "Harry Potter and The Philosopher's Stone", price: "Rs.250 (per person)" },
    { image: img2, name: "Harry Potter and The Chamber of Secrets",  price: "Rs.250 (per person)" },
    /*{ image: img3, name: "Harry Potter and The Prisoner of Azkaban",  price: "Rs.250 (per person)" },
    { image: img4, name: "Harry Potter and The Goblet of Fire", price: "Rs.300 (per person)" },
    { image: img5, name: "Harry Potter and The Order of the Phoenix",  price: "Rs.300 (per person)" },
    { image: img6, name: "Harry Potter and The Half-Blood Prince",  price: "Rs.300 (per person)" },
    { image: img7, name: "Harry Potter and The Deathly Hallows – Part 1", price: "Rs.350 (per person)" },
    { image: img8, name: "Harry Potter and The Deathly Hallows – Part 2",  price: "Rs.350 (per person)" },*/
  ];

  // store counts for all items: [0,0,0,0,0,0]
  const [counts, setCounts] = useState(Array(courses.length).fill(0));

  // Increment
  const increase = (index) => {
    const newCounts = [...counts];
    newCounts[index]++;
    setCounts(newCounts);
  };

  // Decrement
  const decrease = (index) => {
    const newCounts = [...counts];
    if (newCounts[index] > 0) newCounts[index]--;
    setCounts(newCounts);
  };

  // RESET BUTTON FUNCTION
  const resetAll = () => {
    setCounts(Array(courses.length).fill(0));
  };

  return (
    <div>
      {/* RESET BUTTON */}
      <div style={{ textAlign: "center", margin: "20px" }}>
        <center>
            <button className="reset-btn" onClick={resetAll}>RESET ALL</button>
        </center>
      </div>

      {/* 3 column grid */}
      <div className="grid-container">
        {courses.map((course, index) => (
          <Content
            key={index}
            image={course.image}
            name={course.name}
            price={course.price}
            count={counts[index]}
            increase={() => increase(index)}
            decrease={() => decrease(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CourseList;

//style={{ display: 'flex', justifyContent: 'center' }}