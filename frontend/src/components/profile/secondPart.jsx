import Cards from "../common/cards/cards.jsx"
import Add from "../common/cards/add.jsx"
export default function SecondPart({arr}) {
    return <div className="grid pt-5 pl-2 pr-4">
        <div>
            <div className="p-6 font-mono">
                <p className="text-4xl max-lg:text-3xl max-sm:text-2xl">Watch History :</p>
            </div>
            <div className=" grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10">
                <div className="  ">
                     <Cards arr={arr[0]} ></Cards> 
                </div>
                <div className=" ">
                     <Cards arr={arr[1]} ></Cards> 
                </div>
                <div className=" ">
                     <Cards arr={arr[2]} ></Cards> 
                </div>
            </div>
            <div className="flex justify-center pb-10 pt-5">
                    <Add></Add>
                </div>
            
        </div>
        
     {/* <div className="bg-green-400">k</div>
     <div className="bg-yellow-400">d</div>
     <div className="bg-blue-400">w</div> */}
    </div>
}