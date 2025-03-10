import cron from "node-cron";
import { prisma } from "../db/client";
import { socketManager } from "../managers/socket/SocketManager";
import { update_current_slot } from "../message/message";

// Function to update active slots
export async function updateActiveSlots() {
  const currentHour = new Date().getHours(); // Get current hour (0-23)

  try {
    await prisma.$transaction(async (tx) => {
      // Deactivate all slots
      await tx.slot.updateMany({
        where: { isActive: true },
        data: { isActive: false },
      });

      // Activate the slot where start = current hour
      await tx.slot.updateMany({
        where: { start: currentHour },
        data: { isActive: true },
      });

    }, { timeout: 20000 }); // ✅ Correct way to set timeout

    console.log(`✅ Slots updated: Activated slots for ${currentHour}:00`);
    
    const message = JSON.stringify({ start: currentHour });
    socketManager.broadcast(update_current_slot, message);
  } catch (error) {
    console.error("❌ Error updating slots:", error);
  }
}

// Run the cron job every hour at 00 minutes
cron.schedule("0 * * * *", async () => {
  console.log("🔄 Running slot update cron job...");
  await updateActiveSlots();
});

console.log("🕒 Slot cron job initialized!");
