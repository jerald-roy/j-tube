import UpperHeroSection from "./heroUpper"
import HeroSection from "./heroLower"

function MainContent() {
  return <>
    <div className=" bg-[#202020] min-h-screen dark:bg-purple-100 max-sm:pb-14">
      <div className="">
      <UpperHeroSection></UpperHeroSection>
      <HeroSection></HeroSection>
      </div>
      
    </div>

  </>
}

export default MainContent