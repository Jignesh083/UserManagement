//package com.project.service;
//
//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Paths;
//import java.util.Enumeration;
//import java.util.Random;
//import java.util.zip.ZipEntry;
//import java.util.zip.ZipFile;
//import java.util.zip.ZipInputStream;
//
//import org.springframework.stereotype.Service;
//
//@Service
//public class FileUnzipService {
//
//    private static final String UPLOAD_DIR = "D:/uploads/";
//
//    public String unzipFile(String zipFilePath) 
//    {
//        File zipFile = new File(zipFilePath);
//
//        if (!zipFile.exists()) 
//        {
//            System.out.println("ZIP file does not exist: " + zipFilePath);
//            return null;
//        }
//
//        // Generate a random folder name
//        String randomFolderName = "unzipped_" + new Random().nextInt(100000);
//        String outputFolder = UPLOAD_DIR + randomFolderName + "/";
//
//        // Create the directory for extraction
//        File outputDir = new File(outputFolder);
//        if (!outputDir.exists()) {
//            outputDir.mkdirs();
//        }
//
//        try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)))) {
//            ZipEntry entry;
//            while ((entry = zis.getNextEntry()) != null) {
//                File extractedFile = new File(outputFolder, entry.getName());
//
//                // Create parent directories if needed
//                if (entry.isDirectory()) {
//                    extractedFile.mkdirs();
//                } else {
//                    extractedFile.getParentFile().mkdirs();
//                    try (FileOutputStream fos = new FileOutputStream(extractedFile)) {
//                        byte[] buffer = new byte[1024];
//                        int length;
//                        while ((length = zis.read(buffer)) > 0) {
//                            fos.write(buffer, 0, length);
//                        }
//                    }
//                }
//                zis.closeEntry();
//            }
//
//            System.out.println("ZIP file extracted to: " + outputFolder);
//            return outputFolder; 
//
//        } 
//        catch (IOException e) 
//        {
//            System.out.println("Error unzipping file: " + e.getMessage());
//            return null;
//        }
//    }
//}

package com.project.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Random;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

import org.springframework.stereotype.Service;

@Service
public class FileUnzipService {

	public String unzipFile(String zipFilePath, String userUploadDir) {
		File zipFile = new File(zipFilePath);
		if (!zipFile.exists()) {
			System.out.println("ZIP file does not exist: " + zipFilePath);
			return null;
		}

		// Generate a unique folder name for extracted contents
		String extractedFolderName = "unzipped_" + new Random().nextInt(100000);
		String outputFolder = userUploadDir + extractedFolderName + "/";

		// Create the directory for extraction inside the user's folder
		File outputDir = new File(outputFolder);
		if (!outputDir.exists()) {
			outputDir.mkdirs();
		}

		try (ZipInputStream zis = new ZipInputStream(Files.newInputStream(Paths.get(zipFilePath)))) {
			ZipEntry entry;
			while ((entry = zis.getNextEntry()) != null) {
				File extractedFile = new File(outputFolder, entry.getName());

				// Create parent directories if needed
				if (entry.isDirectory()) {
					extractedFile.mkdirs();
				} else {
					extractedFile.getParentFile().mkdirs();
					try (FileOutputStream fos = new FileOutputStream(extractedFile)) {
						byte[] buffer = new byte[1024];
						int length;
						while ((length = zis.read(buffer)) > 0) {
							fos.write(buffer, 0, length);
						}
					}
				}
				zis.closeEntry();
			}

			System.out.println("ZIP file extracted to: " + outputFolder);
			return outputFolder;

		} catch (IOException e) {
			System.out.println("Error unzipping file: " + e.getMessage());
			return null;
		}
	}
}
