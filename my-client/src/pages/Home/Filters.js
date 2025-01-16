
import React from "react";
import { message } from "antd";
import './home.css'
function Filters({ showFilters, setShowFilters, filters, setFilters }) {
  const categories = [
    { name: "زيوت", value: "oils" },
    { name: "مربى", value: "jams" },
    { name: "ألبان", value: "dairy" },
    { name: "عسل", value: "honey" },
    { name: "مخللات", value: "pickles" },
    { name: "أعشاب وبهارات", value: "herbs-and-spices" },
    { name: "حبوب وبقوليات", value: "grains-and-legumes" },
    { name: "لحوم محفوظة", value: "preserved-meats" },
    { name: "أجبان", value: "cheeses" },
    { name: "شراب", value: "syrups" },
    { name: "مكسرات وفواكه مجففة", value: "nuts-and-dried-fruits" },
    { name: "معلبات", value: "canned-goods" },
    { name: "خبز", value: "breads" },
  ];
  const updateFilter = (key, value, checked) => {
    try {
      setFilters((prevFilters) => {
        const updatedKey = checked
          ? [...prevFilters[key], value]
          : prevFilters[key].filter((item) => item !== value);

        return { ...prevFilters, [key]: updatedKey };
      });
    } catch (error) {
      message.error("حدث خطأ أثناء تحديث الفلاتر"); // Error message in case of failure
    }
  };

  return (
    <div className="w-72 flex flex-col border-r border-gray-300 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-orange-500 text-xl">الفلاتر</h1>
        <i
          className="ri-close-line text-xl cursor-pointer"
          onClick={() => setShowFilters(!showFilters)}
        ></i>
      </div>
      <div className="flex flex-col gap-5 mt-5">
        {/* Categories */}
        <div>
          <h1 className="text-gray-600 font-semibold mb-2">الفئات</h1>
          {categories.map((category) => (
            <div key={category.value} className="flex items-center gap-2">
              <input
                class="A"
                type="checkbox"
                checked={filters.category.includes(category.value)}
                onChange={(e) =>
                  updateFilter("category", category.value, e.target.checked)
                }
              />
              <label>{category.name}</label>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Filters;
