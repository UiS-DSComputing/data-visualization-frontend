import React from "react";
import dm from "./index.module.css";
function DataMarket() {
    const moTypes=[
        {name:"Images",number:1289},
        {name:"Video",number:678},
        {name:"Texts",number:523},
        {name:"Audio",number:339},
        {name:"Medical",number:89},
        {name:"Environment",number:73},
        {name:"3D",number:34},
        {name:"Graphs",number:25},
    ]
    const taskTypes=[
        {name:"Question Answering", number:293},
        {name:"Semantic Segmentation", number:223},
        {name:"Object Detection", number:213},
        {name:"Speech Recognition", number:184},
        {name:"Image Classification", number:113},
    ]
    const langTypes=[
        {name:"English",number:1767},
        {name:"Chinese",number:267},
        {name:"German",number:133},
        {name:"French",number:108},
        {name:"Spanish",number:91},
    ]
  return (
    <div className={dm.layout}>
      <div className={dm.filters}>
        <div className={dm.filter}>
            <input></input>
        </div>
        <Filter title="Modality" types={moTypes}/>
        <Filter title="Task" types={taskTypes} />
        <Filter title="Language" types={langTypes} />
      </div>
      <div className={dm.results}></div>
    </div>
  );
}
function Filter(props){
    const {types,title}=props
    return (
        <div className={dm.filter}>
          <div className={dm.title}>Filter by {title}</div>
          <div className={dm.items}>
          {types.map((item)=>{
            return <div key={item.name} className={dm.item}>
                <span className={dm.name}>{item.name}</span>
                <span className={dm.number}>{item.number}</span>
            </div>
        })}
          </div>
 

        </div>
    )
}
export default DataMarket;
