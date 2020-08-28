export class SpineBackground {
  constructor(assetManager, skeletonFile) {
    this.skeletonFile = skeletonFile;
    this.atlasFile = this.skeletonFile.replace("-pro", "").replace("-ess", "").replace(".json", ".atlas");

    this.assetManager = assetManager;
    this.assetManager.loadText(this.skeletonFile);
    this.assetManager.loadTextureAtlas(this.atlasFile);
  }

  createMesh() {
    // Load the texture atlas using name.atlas and name.png from the AssetManager.
    // The function passed to TextureAtlas is used to resolve relative paths.
    let atlas = this.assetManager.get(this.atlasFile);
    let skeleton = this.assetManager.get(this.skeletonFile);

    // Create a AtlasAttachmentLoader that resolves region, mesh, boundingbox and path attachments
    let atlasLoader = new spine.AtlasAttachmentLoader(atlas);

    // Create a SkeletonJson instance for parsing the .json file.
    let skeletonJson = new spine.SkeletonJson(atlasLoader);

    // Set the scale to apply during parsing, parse the file, and create a new skeleton.
    skeletonJson.scale = 0.3;
    let skeletonData = skeletonJson.readSkeletonData(skeleton);

    // Create a SkeletonMesh from the data and attach it to the scene
    let skeletonMesh = new spine.threejs.SkeletonMesh(skeletonData, function(parameters) {
      parameters.depthTest = false;
    });

    skeletonMesh.state.setAnimation(0, "animation", true);
    skeletonMesh.skeleton.y = -120;
    return skeletonMesh;
  }
}
