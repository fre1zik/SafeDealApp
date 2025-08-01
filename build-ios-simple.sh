#!/bin/bash

echo "🚀 Building iOS App (Simple Version)"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the SafeDealApp directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Install CocoaPods if not installed
if ! command -v pod &> /dev/null; then
    echo "📱 Installing CocoaPods..."
    sudo gem install cocoapods
fi

# Install iOS dependencies
echo "📱 Installing iOS dependencies..."
cd ios && pod install && cd ..

# Build archive
echo "🏗️ Building iOS archive..."
cd ios
xcodebuild -workspace SafeDealApp.xcworkspace \
           -scheme SafeDealApp \
           -configuration Debug \
           -destination generic/platform=iOS \
           -archivePath SafeDealApp.xcarchive \
           archive \
           CODE_SIGN_IDENTITY="" \
           CODE_SIGNING_REQUIRED=NO \
           CODE_SIGNING_ALLOWED=NO \
           DEVELOPMENT_TEAM="" \
           PROVISIONING_PROFILE=""

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Archive created: ios/SafeDealApp.xcarchive"
    echo ""
    echo "📋 Next steps:"
    echo "1. Open Xcode"
    echo "2. Window → Organizer"
    echo "3. Import SafeDealApp.xcarchive"
    echo "4. Distribute App → Development"
else
    echo "❌ Build failed!"
    exit 1
fi 