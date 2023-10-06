import React from "react";

const Card = ({ data }: any) => {
  console.log(data);
  //   const stats = data.stats.forEach((item: any) => {
  //     return {
  //       name: item.stat.name,
  //       value: item.base_stat,
  //     };
  //   });

  return (
    <article className="Card_container">
      <h2>{data.name}</h2>
      <img src={data.imgURL} alt={`sprite for ${data.name}`} />
      {/* <div className="Card_stats">
        {stats.forEach((element: any) => {
          return <p>{`${element.name}: ${element.value}`}</p>;
        })}
      </div> */}
    </article>
  );
};

export default Card;
