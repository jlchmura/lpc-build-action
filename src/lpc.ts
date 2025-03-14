import * as core from '@actions/core';
import * as lpc from "lpc";
import ansiStyles from "ansi-styles";
import Convert from 'ansi-to-html';

const problemMatcher = /^([^\s].*)[\(:](\d+)[,:](\d+)(?:\):\s+|\s+-\s+)(error|warning|info)\s+LPC(\d+)\s*:\s*(.*)$/;
const ansiToHtml = new Convert();

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // trap the console output - since lpc is so chatty
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};

    console.log = (msg) => { core.info(msg) };
    console.info = (msg) => { core.info(msg) };
    console.warn = (msg) => { core.warning(msg) };

    lpc.sys.writeOutputIsTTY = () => true; // force color on
    
    let hadError = false;
    
    // redirect lpc output to core.info
    lpc.sys.write = (message: string) => {
      const cleanedMessage = message.trim();
      const match = problemMatcher.exec(cleanedMessage);
      // if match is found, log as error
      if (match) {
        hadError = true;                   
        core.error(cleanedMessage, {
          file: core.toPlatformPath(match[1]),
          startLine: parseInt(match[2]),
          startColumn: parseInt(match[3]),                        
          title: `LPC${match[5]}: ${match[6]}`            
        }); 
      } else {        
        core.info(cleanedMessage);
      }
    }            

    const lpcConfig = core.getInput('lpc-config');
    if (!lpcConfig) {
      core.setFailed("No lpc-config input provided");
      return;
    }

    core.info(`Running lpc build with config: ${lpcConfig}`);      

    core.startGroup("Build Output");
    lpc.executeCommandLine(lpc.sys, ["--project", core.toPlatformPath(lpcConfig)], onExecuteCommandMsg);
        
    if (hadError) {
      core.setFailed(ansiStyles.color.redBright + "LPC build failed");
    } 
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
  
  core.summary.write();

  function onExecuteCommandMsg(msg: string, msgType?: lpc.ExecuteCommandMsgType) {
    core.endGroup();

    switch (msgType) {
      case lpc.ExecuteCommandMsgType.Failure:
        core.summary.addRaw(`<div>${ansiToHtml.toHtml(msg)}</div>`);
        core.setFailed(msg.trim());
        break;      
      case lpc.ExecuteCommandMsgType.Success:
        core.summary.addRaw(`<div>${ansiToHtml.toHtml(msg)}</div>`);
        core.info(msg.trim());
        break;
      default:
        core.info(msg.trim());
    }    
  }
}

 