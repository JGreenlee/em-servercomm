#import <Cordova/CDV.h>

@interface BEMCommunicationHelperPlugin: CDVPlugin <UINavigationControllerDelegate>

- (void) pushGetJSON:(CDVInvokedUrlCommand*)command;

@end
