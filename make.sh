#!/bin/bash

# Modala to Android App Converter

# Check for input file
if [ $# -eq 0 ]; then
    echo "Usage: $0 <input_file.json>"
    exit 1
fi

INPUT_FILE=$1
OUTPUT_DIR="android_app"

echo "Starting conversion process for $INPUT_FILE"

# Create output directory
mkdir -p $OUTPUT_DIR
echo "Created output directory: $OUTPUT_DIR"

# Convert Modala to Android JSON
echo "Converting Modala JSON to Android JSON..."
node -e "
const fs = require('fs');
const dotpipe = require('./dotpipe.js');
const modalaJSON = JSON.parse(fs.readFileSync('$INPUT_FILE', 'utf8'));
const androidJSON = dotpipe.createAndroidHierarchy(modalaJSON);
fs.writeFileSync('$OUTPUT_DIR/layout.json', JSON.stringify(androidJSON, null, 2));
"
echo "Android JSON created: $OUTPUT_DIR/layout.json"

# Convert Android JSON to XML
echo "Converting Android JSON to XML..."
node -e "
const fs = require('fs');
const xml2js = require('xml2js');
const androidJSON = JSON.parse(fs.readFileSync('$OUTPUT_DIR/layout.json', 'utf8'));
const builder = new xml2js.Builder();
const xml = builder.buildObject(androidJSON);
fs.writeFileSync('$OUTPUT_DIR/layout.xml', xml);
"
echo "Android XML layout created: $OUTPUT_DIR/layout.xml"

# Create Android project structure
echo "Creating Android project structure..."
mkdir -p $OUTPUT_DIR/app/src/main/java/com/example/modalaapp
mkdir -p $OUTPUT_DIR/app/src/main/res/layout
echo "Project structure created"

# Move layout file
mv $OUTPUT_DIR/layout.xml $OUTPUT_DIR/app/src/main/res/layout/activity_main.xml
echo "Layout file moved to: $OUTPUT_DIR/app/src/main/res/layout/activity_main.xml"

# Create MainActivity.java
echo "Creating MainActivity.java..."
cat << EOF > $OUTPUT_DIR/app/src/main/java/com/example/modalaapp/MainActivity.java
package com.example.modalaapp;

import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}
EOF
echo "MainActivity.java created"

# Create build.gradle
echo "Creating build.gradle..."
cat << EOF > $OUTPUT_DIR/app/build.gradle
apply plugin: 'com.android.application'

android {
    compileSdkVersion 30
    defaultConfig {
        applicationId "com.example.modalaapp"
        minSdkVersion 21
        targetSdkVersion 30
        versionCode 1
        versionName "1.0"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.3.0'
}
EOF
echo "build.gradle created"

# Build the Android app
echo "Building the Android app..."
cd $OUTPUT_DIR
gradle build

echo "Android app creation process completed. Output directory: $OUTPUT_DIR"