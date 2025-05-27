export const drawLines = (points, red, green, blue, alpha, phase, lineWidth) => {
    if (!lineWidth) lineWidth = 2.0;
    if (!points || points.length < 2) return; // Need at least 2 points to draw a line

    GlStateManager.func_179094_E(); // pushMatrix
    GL11.glLineWidth(lineWidth);
    GL11.glDisable(GL11.GL_CULL_FACE);
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glBlendFunc(770, 771);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glDepthMask(false);

    if (phase) {
        GL11.glDisable(GL11.GL_DEPTH_TEST);
    }

    Tessellator.begin(3) // GL_LINE_STRIP
        .colorize(red, green, blue, alpha);

    for (let point of points) {
        Tessellator.pos(point.x, point.y, point.z);
    }

    Tessellator.draw();

    GL11.glEnable(GL11.GL_CULL_FACE);
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glDepthMask(true);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    if (phase) {
        GL11.glEnable(GL11.GL_DEPTH_TEST);
    }

    GlStateManager.func_179121_F(); // popMatrix
};