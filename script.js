document.addEventListener("DOMContentLoaded", () => {
  const playground = document.querySelector(".playground");
  const squares = document.querySelectorAll(".playground div");
  const colors = ["red", "blue", "green", "white"];
  const colorButtons = document.querySelectorAll(".color-button");
  const SNAP_DISTANCE = 20;

  let selectedSquare = null;
  let startX, startY, initialX, initialY;
  let isSquareSelected = false;
  let snappedPair = null;

  squares.forEach((square, index) => {
    square.dataset.id = index;

    square.addEventListener("mousedown", (event) => {
      if (isSquareSelected) {
        squares.forEach((square) => square.classList.remove("selected"));
        isSquareSelected = false;
      } else {
        squares.forEach((square) => square.classList.remove("selected"));
        square.classList.add("selected");
        isSquareSelected = true;
      }

      selectedSquare = square;
      startX = event.clientX;
      startY = event.clientY;

      const rect = selectedSquare.getBoundingClientRect();

      initialX = Math.round(
        rect.left - playground.getBoundingClientRect().left
      );
      initialY = Math.round(rect.top - playground.getBoundingClientRect().top);

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const colorIndex = button.dataset.index;
      changeColor(colorIndex);
    });
  });

  function changeColor(colorIndex) {
    if (selectedSquare) {
      selectedSquare.style.backgroundColor = colors[colorIndex];
    }
  }

  function isSnappingDistance(square1, square2) {
    const rect1 = square1.getBoundingClientRect();
    const rect2 = square2.getBoundingClientRect();

    const deltaX =
      Math.abs(rect1.left - rect2.left) - rect1.width / 2 - rect2.width / 2;
    const deltaY =
      Math.abs(rect1.top - rect2.top) - rect1.height / 2 - rect2.height / 2;

    return deltaX <= SNAP_DISTANCE && deltaY <= SNAP_DISTANCE;
  }

  function handleSnap(selectedSquare) {
    if (!selectedSquare) return;

    squares.forEach((square) => {
      if (
        square !== selectedSquare &&
        isSnappingDistance(selectedSquare, square)
      ) {
        selectedSquare.classList.add("snapped");
        square.classList.add("snapped");
        snappedPair = { square1: selectedSquare, square2: square };
      } else {
        square.classList.remove("snapped");
      }
    });
  }

  function onMouseMove(event) {
    if (!selectedSquare) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    const deltaX = currentX - startX;
    const deltaY = currentY - startY;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    const playgroundRect = playground.getBoundingClientRect();
    const squareRect = selectedSquare.getBoundingClientRect();

    const borderWidth = 2;

    if (snappedPair) {
      const otherSquare =
        snappedPair.square1 === selectedSquare
          ? snappedPair.square2
          : snappedPair.square1;
      const otherRect = otherSquare.getBoundingClientRect();

      const combinedWidth = squareRect.width + otherRect.width;
      const combinedHeight = squareRect.height + otherRect.height;

      if (
        newX >= playgroundRect.left &&
        newX + combinedWidth <= playgroundRect.right - borderWidth
      ) {
        selectedSquare.style.left = `${newX}px`;
        otherSquare.style.left = `${newX + squareRect.width}px`;
      }

      if (
        newY >= playgroundRect.top &&
        newY + combinedHeight <= playgroundRect.bottom - borderWidth
      ) {
        selectedSquare.style.top = `${newY}px`;
        otherSquare.style.top = `${newY + squareRect.height}px`;
      }
    } else {
      if (
        newX >= playgroundRect.left &&
        newX + squareRect.width <= playgroundRect.right - borderWidth
      ) {
        selectedSquare.style.left = `${newX}px`;
      }

      if (
        newY >= playgroundRect.top &&
        newY + squareRect.height <= playgroundRect.bottom - borderWidth
      ) {
        selectedSquare.style.top = `${newY}px`;
      }
    }

    handleSnap(selectedSquare);
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
});
