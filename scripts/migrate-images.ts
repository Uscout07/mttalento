// scripts/migrate-images.ts

import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  // 2. List all items (folders/files) inside the `actors` folder
  const { data: folderData, error: folderError } = await supabase
    .storage
    .from('assets')
    .list('actors', { limit: 100, sortBy: { column: 'name', order: 'asc' } });

  if (folderError) {
    console.error('Error listing actors folder:', folderError);
    return;
  }

  // 3. For each subfolder (representing an actor)
  for (const folder of folderData ?? []) {
    if (folder.metadata && folder.metadata.isFolder) {
      const folderName = folder.name; // e.g. "FabioLevy"

      // Try to find a matching profile by comparing "name" minus spaces
      // 3a. Fetch all profiles (or use a more direct query if you store slugs)
      const { data: allProfiles, error: profileError } = await supabase
        .from('profile')
        .select('id, name');

      if (profileError || !allProfiles) {
        console.error('Error fetching profiles:', profileError);
        continue;
      }

      // 3b. Attempt to match folderName to a profile by removing spaces
      let matchingProfileId: string | null = null;
      for (const p of allProfiles) {
        const sanitizedName = p.name.replace(/\s+/g, ''); // e.g. "FabioLevy"
        if (sanitizedName.toLowerCase() === folderName.toLowerCase()) {
          matchingProfileId = p.id;
          break;
        }
      }

      if (!matchingProfileId) {
        console.warn(`No matching profile found for folder: ${folderName}`);
        continue;
      }

      // 4. List all files in the `images` subfolder
      const imagesPath = `actors/${folderName}/images`;
      const { data: files, error: filesError } = await supabase
        .storage
        .from('assets')
        .list(imagesPath);

      if (filesError) {
        console.error(`Error listing files in ${imagesPath}:`, filesError);
        continue;
      }

      // 5. For each file, build its public URL and insert a row in `profile_images`
      for (const file of files ?? []) {
        if (!file.metadata.isFolder) {
          const filePath = `${imagesPath}/${file.name}`;

          // 5a. Generate the public URL
          const { data: publicUrlData } = supabase
            .storage
            .from('assets')
            .getPublicUrl(filePath);

          const publicUrl = publicUrlData?.publicUrl;
          if (!publicUrl) {
            console.warn('No public URL found for:', filePath);
            continue;
          }

          // 5b. Insert into `profile_images`
          const { error: insertError } = await supabase
            .from('profile_images')
            .insert({
              profile_id: matchingProfileId,
              file_url: publicUrl,
            });

          if (insertError) {
            console.error('Error inserting into profile_images:', insertError);
          } else {
            console.log(`Inserted: ${folderName} -> ${file.name}`);
          }
        }
      }
    }
  }
}

// Run the script
main().then(() => {
  console.log('Migration complete.');
  process.exit(0);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
