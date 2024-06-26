import { useEffect, useState } from "react";
import { FunctionalSection } from "./FunctionalSection";
import { ActiveTab, Dog } from "../types";
import { Requests } from "../api";
import { FunctionalDogs } from "./FunctionalDogs";
import { FunctionalCreateDogForm } from "./FunctionalCreateDogForm";

export function FunctionalApp() {
  const [allDogs, setAllDogs] = useState<Dog[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>("none-selected");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    refetchData();
  }, []);

  const refetchData = () => {
    setIsLoading(true);
    return Requests.getAllDogs()
      .then((dogs) => {
        setAllDogs(dogs);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleHeartClick = (id: number, isFavorite: boolean) => {
    setIsLoading(true);
    return Requests.updateDog({
      id: id,
      isFavorite: isFavorite,
    })
      .then(() => {
        return refetchData();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteDog = (id: number) => {
    return Requests.deleteDog(id).then(refetchData);
  };

  const createDog = (dog: Omit<Dog, "id">) => {
    return Requests.postDog(dog).then(refetchData);
  };

  const favoritedDogsCount = allDogs.filter((dog) => dog.isFavorite).length;
  const unfavoritedDogsCount = allDogs.filter((dog) => !dog.isFavorite).length;

  let filteredDogs = allDogs.filter((dog) => {
    if (activeTab === "create dog") return false;
    if (activeTab === "favorited") return dog.isFavorite;
    if (activeTab === "unfavorited") return !dog.isFavorite;
    if (activeTab === "none-selected") return true;
  });

  return (
    <div className="App" style={{ backgroundColor: "skyblue" }}>
      <header>
        <h1>pup-e-picker (Functional)</h1>
      </header>
      <FunctionalSection
        activeTab={activeTab}
        isLoading={isLoading}
        favoritedCount={favoritedDogsCount}
        unfavoritedCount={unfavoritedDogsCount}
        setActiveTab={setActiveTab}
      >
        {activeTab !== "create dog" && (
          <FunctionalDogs
            dogs={filteredDogs}
            deleteDog={deleteDog}
            onEmptyHeartClick={handleHeartClick}
            onHeartClick={handleHeartClick}
            isLoading={isLoading}
          />
        )}
        {activeTab === "create dog" && (
          <FunctionalCreateDogForm createDog={createDog} />
        )}
      </FunctionalSection>
    </div>
  );
}
