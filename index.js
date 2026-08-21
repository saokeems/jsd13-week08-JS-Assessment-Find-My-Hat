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

    //แก้ให้หา ตำแหน่งเริ่มของ random player
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[y].length; x++) {
        if (field[y][x] === pathCharacter) {
          this.locationY = y;
          this.locationX = x;
        }
      }
    }
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
    // return;
  }

  moveDown() {
    this.updatePath();
    this.locationY += 1;
    // return;
  }

  moveLeft() {
    this.updatePath();
    this.locationX -= 1;
    // return;
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

  // สร้าง field เพื่อให้มี field สำหรับสุ่มตำแหน่ง player, หมวก
  for (let y = 0; y < height; y++) {
    const row = [];

    // สุ่มตำแหน่ง หลุม
    for (let x = 0; x < width; x++) {
      const isHole = Math.random() < percentage;
      row.push(isHole ? hole : fieldCharacter);
    }
    field.push(row);
  }

  // เพิ่มสุ่มตำแหน่ง player
  let playerX = Math.floor(Math.random() * height);
  let playerY = Math.floor(Math.random() * width);

  // เช็คว่าตรงกับหลุมหรือเปล่า
  if (field[playerY][playerX] === hole) {
    return randomField(height, width);
  }

  field[playerY][playerX] = pathCharacter;

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
const displayField = () => {
  console.clear();
  player.print();
};

console.log("================================");
console.log("          Link Start!!!         ");
console.log("================================");
console.log();

player.print();

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

      // console.clear();

      const isPlaying = checkField(player);

      if (isPlaying) {
        displayField();
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

// displayField();
askForCommand();
