import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

// console.log(rl)

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
    this.field[0][0] = pathCharacter;
  }

  print() {
    this.field.forEach((row) => console.log(row.join("")));
  }

  updatePath() {
    this.field[this.locationY][this.locationX] = fieldCharacter;
  }

  moveUp() {
    this.updatePath();
    this.locationY -= 1;
    return;
  }

  moveDown() {
    this.updatePath();
    this.locationY += 1;
    return;
  }

  moveLeft() {
    this.updatePath();
    this.locationX -= 1;
    return;
  }

  moveRight() {
    this.updatePath();
    this.locationX += 1;
    return;
  }
}

// random ด่าน ตำแหน่งหลุม ตำแหน่งหมวก
const randomField = (height, width) => {
  const maxHolePercentage = 0.25;
  const percentage = Math.random() * maxHolePercentage;

  const field = [];

  // สุ่มตำแหน่งหลุม
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const isHole = Math.random() < percentage;
      row.push(isHole ? hole : fieldCharacter);
    }
    field.push(row);
  }

  // สุ่มตำแหน่งหมวก
  let hatX = Math.floor(Math.random() * width);
  let hatY = Math.floor(Math.random() * height);

  while (hatX === 0 && hatY === 0) {
    hatX = Math.floor(Math.random() * width);
    hatY = Math.floor(Math.random() * height);
  }

  field[hatY][hatX] = hat;

  return field;
};

const checkField = (player) => {
  const { locationX, locationY, field } = player;

  if (
    locationY < 0 ||
    locationY >= field.length ||
    locationX < 0 ||
    locationX >= field[0].length
  ) {
    console.log("\nYou have left the field area! Game Over!\n");
    return false;
  }

  const currentPosition = field[locationY][locationX];
  if (currentPosition === hole) {
    console.log("\nYou fell in a hole! Game Over!\n");
    return false;
  }

  if (currentPosition === hat) {
    console.log("\nYou found your hat! Congratulations!\n");
    return false;
  }

  field[locationY][locationX] = pathCharacter;
  return true;
};

// เรียก randomField ให้สุ่มด่าน และสร้าง player โดยให้สุ่มแมพขนาด 10, 10
const player = new Field(randomField(10, 10));

// ฟังก์ชันแสดงด่าน
const displayField = (clear = true) => {
  player.print(clear);
};

// ฟังก์ชันแสดงคำถามคำสั่ง
const askForCommand = () => {
  rl.question(
    "\nWhich way? [W] | [A] | [S] | [D] | [Q] to quit: ",
    (answer) => {
      const command = answer.trim().toLocaleLowerCase();

      if (command === "q") {
        console.log("\nYou have left the game.\n");
        rl.close();
        return;
      }

      const validCommand = handleCommand(command);

      if (!validCommand) {
        console.log("\nPlease enter w, a, s, d or q");
        askForCommand();
        return;
      }

      console.clear();

      const isPlaying = checkField(player);
      
      displayField();

      if (isPlaying) {
        askForCommand();
      } else {
        rl.close();
      }
    },
  );
};

// ฟังก์ชันควบคุมคำสั่ง
const handleCommand = (command) => {
  if (command === "w") {
    player.moveUp();
  } else if (command === "a") {
    player.moveLeft();
  } else if (command === "s") {
    player.moveDown();
  } else if (command === "d") {
    player.moveRight();
  } else {
    return false;
  }
  return true;
};

displayField();
askForCommand();
