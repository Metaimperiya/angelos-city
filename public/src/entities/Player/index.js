// Внутри вашего лупа (tick / update / animate):
const mouseDelta = this.input.getAndResetMouseDelta();

// 1. Вращаем камеру
this.playerCamera.update(mouseDelta);

// 2. Двигаем игрока с учётом нажатых клавиш и угла поворота камеры
this.playerController.update(this.input);
